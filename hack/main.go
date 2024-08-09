package main

import (
	"encoding/json"
	"fmt"

	"github.com/alecthomas/jsonschema"
	uds "github.com/defenseunicorns/uds-cli/src/types"
	"github.com/zarf-dev/zarf/src/api/v1alpha1"
)

type genTypes struct {
	UDSBundle   uds.UDSBundle
	ZarfPackage v1alpha1.ZarfPackage
}

// go run main.go | npx quicktype -s schema -o ../ui/src/types.ts
func main() {
	schema := jsonschema.Reflect(&genTypes{})
	output, err := json.Marshal(schema)
	if err != nil {
		panic(err)
	}
	fmt.Print(string(output))
}
