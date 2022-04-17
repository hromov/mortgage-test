package main

import (
	"bytes"
	"encoding/json"
	"io/ioutil"
	"net/http"
	"net/http/httptest"
	"testing"
)

var postTestCases = []struct {
	name     string
	in       []Bank
	expected []Bank
}{
	{
		name: "proper bank case",
		in: []Bank{
			{
				ID:       "",
				Name:     "Bank name",
				Interest: 0.2,
				MaxLoan:  10000,
				MinDown:  0.1,
				Term:     12,
			},
			{
				ID:       "",
				Name:     "Another Bank name",
				Interest: 0.4,
				MaxLoan:  1000,
				MinDown:  0.01,
				Term:     3,
			},
		},
		expected: []Bank{
			{
				ID:       "",
				Name:     "Bank name",
				Interest: 0.2,
				MaxLoan:  10000,
				MinDown:  0.1,
				Term:     12,
			},
			{
				ID:       "",
				Name:     "Another Bank name",
				Interest: 0.4,
				MaxLoan:  1000,
				MinDown:  0.01,
				Term:     3,
			},
		},
	},
	{
		name: "Not proper bank case",
		in: []Bank{
			{
				ID:       "223123",
				Name:     "Bank name",
				Interest: 0.2,
				MaxLoan:  10000,
				MinDown:  0.1,
				Term:     12,
			},
		},
		expected: []Bank{},
	},
}

func TestBanksHandler(t *testing.T) {
	req := httptest.NewRequest(http.MethodGet, "/banks", nil)
	w := httptest.NewRecorder()
	banksHandler(w, req)
	res := w.Result()
	defer res.Body.Close()

	// var banks []Bank

	// if err := json.NewDecoder(res.Body).Decode(&banks); err != nil {
	// 	t.Errorf("error while marshal decoding: %v", err)
	// }

	originalData, err := json.Marshal(BANK_DATA)
	if err != nil {
		t.Errorf("internal error: %v", err)
	}

	recivedData, err := ioutil.ReadAll(res.Body)
	if err != nil {
		t.Errorf("expected error to be nil got %v", err)
	}

	result := bytes.Compare(originalData, recivedData)

	if result != 0 {
		t.Errorf("original and recived data are not equal. bytes.Compare = %d", result)
		// log.Println("original = ", string(originalData))
		// log.Println("recived = ", string(recivedData))
	}
}

func TestNewBankHandler(t *testing.T) {

	// nil post check
	req := httptest.NewRequest(http.MethodPost, "/banks", nil)
	w := httptest.NewRecorder()
	newBankHandler(w, req)
	res := w.Result()
	defer res.Body.Close()

	if res.StatusCode != http.StatusBadRequest {
		t.Errorf("expected status code to be 400, for nil post request. But it's = %v", res.StatusCode)
	}

	for _, tc := range postTestCases {
		t.Run(tc.name, func(t *testing.T) {
			for i := 0; i < len(tc.in); i++ {

				b, err := json.Marshal(tc.in[i])
				if err != nil {
					t.Errorf("my fault")
				}

				req := httptest.NewRequest(http.MethodPost, "/banks", bytes.NewBuffer(b))
				w := httptest.NewRecorder()
				newBankHandler(w, req)
				res := w.Result()
				defer res.Body.Close()

				if tc.in[i].ID != "" && res.StatusCode != http.StatusBadRequest {
					t.Errorf("Expected http.StatusBadRequest for bank with preset ID. Got %d", res.StatusCode)
				}
				if tc.in[i].ID != "" {
					continue
				}
				if res.StatusCode != http.StatusOK {
					t.Errorf("Expected http.StatusOK but it's = %v", res.StatusCode)
				}

				var bank Bank

				err = json.NewDecoder(res.Body).Decode(&bank)
				if err != nil {
					t.Errorf("response decode error: %v", err)
					return
				}

				if bank.ID == "" {
					t.Errorf("No bank ID was assigned")
				}
				if bank.Interest != tc.in[i].Interest || bank.MaxLoan != tc.in[i].MaxLoan || bank.MinDown != tc.in[i].MinDown || bank.Name != tc.in[i].Name || bank.Term != tc.in[i].Term {
					t.Errorf("request bank and created bank are not equal: %v != %v", b, bank)
				}
			}
		})
	}

}
