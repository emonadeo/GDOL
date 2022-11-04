package gdol

// swagger:response
type GenericErrorResponse struct {
	// in:body
	Body struct {
		Message string `json:"message"`
	}
}
