package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"sync"
	"time"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
)

type Bank struct {
	ID       string  `json:"id"`
	Name     string  `json:"name"`
	Interest float32 `json:"interest"`
	MaxLoan  int     `json:"max_loan"`
	MinDown  float32 `json:"min_down"`
	Term     int32   `json:"term"`
}

type DATA_BASE struct {
	mu    sync.Mutex
	banks []Bank
}

func (db *DATA_BASE) GetBanks() []Bank {
	return db.banks
}

// var BANK_DATA = []Bank{
// 	{ID: "0", Name: "Bank of America", Interest: 0.2, MaxLoan: 40000, MinDown: 0.3, Term: 12},
// 	{ID: "1", Name: "Bank of China", Interest: 0.2, MaxLoan: 2000000, MinDown: 0.25, Term: 14},
// 	{ID: "2", Name: "Bank of Ukraine", Interest: 0.2, MaxLoan: 20000, MinDown: 0.2, Term: 9},
// 	{ID: "3", Name: "Bank of Spain", Interest: 0.2, MaxLoan: 100000, MinDown: 0.4, Term: 16},
// 	{ID: "4", Name: "Bank of Italy", Interest: 0.2, MaxLoan: 300000, MinDown: 0.5, Term: 32},
// }

var BANKS_DATA = DATA_BASE{
	banks: []Bank{
		{ID: "0", Name: "Bank of America", Interest: 0.2, MaxLoan: 40000, MinDown: 0.3, Term: 12},
		{ID: "1", Name: "Bank of China", Interest: 0.2, MaxLoan: 2000000, MinDown: 0.25, Term: 14},
		{ID: "2", Name: "Bank of Ukraine", Interest: 0.2, MaxLoan: 20000, MinDown: 0.2, Term: 9},
		{ID: "3", Name: "Bank of Spain", Interest: 0.2, MaxLoan: 100000, MinDown: 0.4, Term: 16},
		{ID: "4", Name: "Bank of Italy", Interest: 0.2, MaxLoan: 300000, MinDown: 0.5, Term: 32},
	},
}

func banksHandler(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/banks" {
		http.NotFound(w, r)
		return
	}
	b, err := json.Marshal(BANKS_DATA.GetBanks())
	if err != nil {
		http.Error(w, http.StatusText(http.StatusInternalServerError),
			http.StatusInternalServerError)
		return
	}
	// log.Println(BANK_DATA)
	fmt.Fprintf(w, string(b))
}

func bankChangeHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	ID := vars["id"]
	if ID == "" {
		http.Error(w, "blank ID error", http.StatusBadRequest)
		return
	}

	//search bank index in base
	bankIndex := -1
	BANKS_DATA.mu.Lock()
	defer BANKS_DATA.mu.Unlock()
	for i, bank := range BANKS_DATA.GetBanks() {
		if bank.ID == ID {
			bankIndex = i
		}
	}

	if bankIndex == -1 {
		http.NotFound(w, r)
		return
	}

	switch r.Method {
	case "PUT":
		var b Bank

		err := json.NewDecoder(r.Body).Decode(&b)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		BANKS_DATA.banks[bankIndex] = b
		w.WriteHeader(http.StatusOK)
		return
	case "DELETE":

		BANKS_DATA.banks = append(BANKS_DATA.banks[:bankIndex], BANKS_DATA.banks[bankIndex+1:]...)
		w.WriteHeader(http.StatusOK)
		return
	}
}

func validityCheck(bank *Bank) bool {
	if bank == nil || bank.Interest <= 0.0 || bank.MaxLoan < 0 || bank.MinDown < 0.0 || bank.Name == "" || bank.Term < 0 {
		return false
	}
	return true
}

func newBankHandler(w http.ResponseWriter, r *http.Request) {
	var b Bank

	err := json.NewDecoder(r.Body).Decode(&b)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	if b.ID != "" {
		http.Error(w, "Can't POST bank with existing ID", http.StatusBadRequest)
		return
	}
	// log.Println("interest = ", b.Interest)
	if !validityCheck(&b) {
		http.Error(w, fmt.Sprintf("Bad bank data: %v", b), http.StatusBadRequest)
		return
	}
	b.ID = fmt.Sprintf("%d", time.Now().UnixNano())
	BANKS_DATA.mu.Lock()
	defer BANKS_DATA.mu.Unlock()

	BANKS_DATA.banks = append(BANKS_DATA.banks, b)

	bankString, err := json.Marshal(b)
	if err != nil {
		http.Error(w, http.StatusText(http.StatusInternalServerError),
			http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
	fmt.Fprintf(w, string(bankString))
	return
}

func newREST() *mux.Router {
	r := mux.NewRouter()
	r.HandleFunc("/banks", banksHandler).Methods("GET")
	r.HandleFunc("/banks", newBankHandler).Methods("POST")
	r.HandleFunc("/banks/{id}", bankChangeHandler).Methods("PUT", "DELETE")
	return r
}

func main() {

	router := newREST()
	credentials := handlers.AllowCredentials()
	methods := handlers.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE"})
	headersOk := handlers.AllowedHeaders([]string{"Accept", "Accept-Language", "Content-Type", "Content-Language", "Origin", "X-Requested-With", "application/json"})

	// ttl := handlers.MaxAge(3600)
	origins := handlers.AllowedOrigins([]string{"http://localhost:4200", os.Getenv("ORIGIN_ALLOWED"), "https://mortgage-test-347507.lm.r.appspot.com"})
	log.Fatal(http.ListenAndServe(":8080", handlers.CORS(credentials, methods, origins, headersOk)(router)))
}
