package main

import (
	"encoding/json"
	"fmt"

	"github.com/alecthomas/jsonschema"
	uds "github.com/defenseunicorns/uds-cli/src/types"
	"github.com/zarf-dev/zarf/src/api/v1alpha1"
	"github.com/zarf-dev/zarf/src/types"
)

type genTypes struct {
	UDSBundle       uds.UDSBundle
	DeployedPackage types.DeployedPackage
	ZarfPackage     v1alpha1.ZarfPackage
	ZarfState       types.ZarfState
}

// go run main.go | npx quicktype -s schema -o ../ui/types.ts
func main() {
	schema := jsonschema.Reflect(&genTypes{})
	output, err := json.Marshal(schema)
	if err != nil {
		panic(err)
	}
	fmt.Print(string(output))
}
