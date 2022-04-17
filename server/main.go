package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"

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
	//Allow CORS here By * or specific origin
	w.Header().Set("Access-Control-Allow-Origin", "*")

	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

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
	log.Println(BANK_DATA)
	fmt.Fprintf(w, string(b))
}

func main() {
	// http.HandleFunc("/banks", banksHandler)

	// port := os.Getenv("PORT")
	// if port == "" {
	// 	port = "8080"
	// 	log.Printf("Defaulting to port %s", port)
	// }

	router := mux.NewRouter()
	//api route is /people,
	//Methods("GET", "OPTIONS") means it support GET, OPTIONS
	router.HandleFunc("/banks", banksHandler).Methods("GET", "OPTIONS")
	log.Fatal(http.ListenAndServe(":8080", router))

	// log.Printf("Listening on port %s", port)
	// if err := http.ListenAndServe(":"+port, nil); err != nil {
	// 	log.Fatal(err)
	// }
}
