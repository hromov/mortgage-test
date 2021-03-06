package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
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

var BANK_DATA = []Bank{
	{ID: "0", Name: "Bank of America", Interest: 0.2, MaxLoan: 40000, MinDown: 0.3, Term: 12},
	{ID: "1", Name: "Bank of China", Interest: 0.2, MaxLoan: 2000000, MinDown: 0.25, Term: 14},
	{ID: "2", Name: "Bank of Ukraine", Interest: 0.2, MaxLoan: 20000, MinDown: 0.2, Term: 9},
	{ID: "3", Name: "Bank of Spain", Interest: 0.2, MaxLoan: 100000, MinDown: 0.4, Term: 16},
	{ID: "4", Name: "Bank of Italy", Interest: 0.2, MaxLoan: 300000, MinDown: 0.5, Term: 32},
}

func banksHandler(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/banks" {
		http.NotFound(w, r)
		return
	}
	b, err := json.Marshal(BANK_DATA)
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
	for i, bank := range BANK_DATA {
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
		BANK_DATA[bankIndex] = b
		w.WriteHeader(http.StatusOK)
		return
	case "DELETE":
		BANK_DATA = append(BANK_DATA[:bankIndex], BANK_DATA[bankIndex+1:]...)
		w.WriteHeader(http.StatusOK)
		return
	}
}

func newBankHandler(w http.ResponseWriter, r *http.Request) {
	var b Bank

	err := json.NewDecoder(r.Body).Decode(&b)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	b.ID = fmt.Sprintf("%d", time.Now().UnixNano())
	BANK_DATA = append(BANK_DATA, b)

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
	origins := handlers.AllowedOrigins([]string{"http://localhost:4200", os.Getenv("ORIGIN_ALLOWED")})
	log.Fatal(http.ListenAndServe(":8080", handlers.CORS(credentials, methods, origins, headersOk)(router)))
}
