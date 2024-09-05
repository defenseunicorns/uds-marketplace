package main

import (
	"encoding/json"
	"fmt"
	"os"
	"strings"

	"github.com/defenseunicorns/uds-marketplace/pkg/types"
	"github.com/invopop/jsonschema"
)

// MarketplaceGenTypes is a struct that contains all the types that need to be included in the schema
type MarketplaceGenTypes struct {
	Application types.Application
}

// generateSchema generates the schema based on the provided type and adds enum definitions
func generateSchema(schemaType string) ([]byte, error) {
	reflector := &jsonschema.Reflector{
		AllowAdditionalProperties:  true,
		RequiredFromJSONSchemaTags: true,
	}
	var schema *jsonschema.Schema
	switch schemaType {
	case "all":
		schema = reflector.Reflect(&MarketplaceGenTypes{})
	case "application":
		schema = reflector.Reflect(&types.Application{})

	default:
		return nil, fmt.Errorf("invalid schema type: %s", schemaType)
	}

	return json.MarshalIndent(schema, "", "  ")
}

//go:generate sh -c "go run . all | npx quicktype -s schema --just-types -o ../ui/src/lib/types/gen.ts"
//go:generate sh -c "echo '// SPDX-License-Identifier: Apache-2.0\n// SPDX-FileCopyrightText: 2024-Present The UDS Authors\n// Generated by hack/main.go do not edit this file directly, edit the types and regenerate with 'go generate' in the hack directory\n' | cat - ../ui/src/lib/types/gen.ts > temp && mv temp ../ui/src/lib/types/gen.ts"
//go:generate sh -c "go run . application > ../schemas/application.schema.json"
func main() {
	if len(os.Args) < 2 {
		fmt.Println("Please specify 'all' or 'application' as an argument")
		os.Exit(1)
	}

	arg := strings.ToLower(os.Args[1])

	output, err := generateSchema(arg)
	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	fmt.Println(string(output))
}
