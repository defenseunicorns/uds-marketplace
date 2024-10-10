// SPDX-License-Identifier: Apache-2.0
// SPDX-FileCopyrightText: 2024-Present The UDS Authors

package types

// Source of truth for the application type
// ./hack/go generate to create schema + ui types
type Application struct {
	Kind     string              `json:"kind" yaml:"kind" xml:"kind"`
	Metadata ApplicationMetadata `json:"metadata" yaml:"metadata" xml:"metadata"`
	Spec     ApplicationSpec     `json:"spec" yaml:"spec" xml:"spec"`
}

type ApplicationMetadata struct {
	Name string `json:"name" yaml:"name" xml:"name"`
}

// TODO: validate fields with team
// TODO: Should be one icon
// TODO: validate required fields (add jsonschema tags)
type ApplicationSpec struct {
	Title              string                        `json:"title" yaml:"title" xml:"title" `
	TagLine            string                        `json:"tagline" yaml:"tagline" xml:"tagline"`
	Description        string                        `json:"description" yaml:"description" xml:"description"`
	Repository         string                        `json:"repository" yaml:"repository" xml:"repository"`
	Icons              []ApplicationIcon             `json:"icons" yaml:"icons" xml:"icons"`
	Categories         []ApplicationCategory         `json:"categories" yaml:"categories" xml:"categories" jsonschema:"enum=AI/ML,enum=Arcade,enum=Collaboration,enum=Command And Control,enum=Databases,enum=Digital Engineering,enum=IT Management,enum=Kubernetes (K8s),enum=Networking,enum=Productivity,enum=Security,enum=Software Dev,enum=Space Operations,enum=Web"`
	Vendor             ApplicationVendor             `json:"vendor" yaml:"vendor" xml:"vendor"`
	ContractingDetails ApplicationContractingDetails `json:"contractingDetails" yaml:"contractingDetails" xml:"contractingDetails"`
	Security           ApplicationSecurity           `json:"security" yaml:"security" xml:"security" jsonschema:"enum=NIST 800-53 Controls Mapped,enum=FIPS Image"`
	Architecture       []ApplicationArchitecture     `json:"architecture" yaml:"architecture" xml:"architecture" jsonschema:"enum=arm64,enum=amd64"`
	Infrastructure     []ApplicationInfrastructure   `json:"infrastructure" yaml:"infrastructure" xml:"infrastructure" jsonschema:"enum=AWS GovCloud (US),enum=Azure Government Cloud,enum=On-prem,enum=Edge"`
	Keywords           []string                      `json:"keywords" yaml:"keywords" xml:"keywords"`
	Links              []ApplicationResourceLink     `json:"links" yaml:"links" xml:"links"`
	Versions           []string                      `json:"versions" yaml:"versions" xml:"versions"`
}

type ApplicationVendor struct {
	Name  string            `json:"name" yaml:"name" xml:"name"`
	URL   string            `json:"url" yaml:"url" xml:"url"`
	Icons []ApplicationIcon `json:"icons" yaml:"icons" xml:"icons"`
}

type ApplicationContractingDetails struct {
	Number              string               `json:"number" yaml:"number" xml:"number"`
	Vehicle             []string             `json:"vehicle" yaml:"vehicle" xml:"vehicle"`
	PricingModel        []ApplicationPricing `json:"pricingModel" yaml:"pricingModel" xml:"pricingModel" jsonschema:"enum=Free,enum=Bring Your Own License"`
	SmallBusinessStatus string               `json:"smallBusinessStatus" yaml:"smallBusinessStatus" xml:"smallBusinessStatus"`
}

type ApplicationIcon struct {
	Src  string `json:"src" yaml:"src" xml:"src"`
	Type string `json:"type" yaml:"type" xml:"type"`
	Size string `json:"size" yaml:"size" xml:"size"`
}

type ApplicationResourceLink struct {
	Description string `json:"description" yaml:"description" xml:"description"`
	URL         string `json:"url" yaml:"url" xml:"url"`
}

// Enum types
type (
	ApplicationPricing        string
	ImpactLevel               string
	ApplicationArchitecture   string
	ApplicationSecurity       string
	ApplicationInfrastructure string
	ApplicationCategory       string
)

// Enum constants
const (
	ApplicationPricingFree ApplicationPricing = "Free"
	ApplicationPricingByol ApplicationPricing = "Bring Your Own License"

	ImpactLevel2 ImpactLevel = "2"
	ImpactLevel4 ImpactLevel = "4"
	ImpactLevel5 ImpactLevel = "5"
	ImpactLevel6 ImpactLevel = "6"

	ApplicationArchitectureArm64 ApplicationArchitecture = "arm64"
	ApplicationArchitectureAmd64 ApplicationArchitecture = "amd64"

	ApplicationInfrastructureAwsGov   ApplicationInfrastructure = "AWS GovCloud (US)"
	ApplicationInfrastructureAzureGov ApplicationInfrastructure = "Azure Government Cloud"
	ApplicationInfrastructureOnPrem   ApplicationInfrastructure = "On-prem"
	ApplicationInfrastructureEdge     ApplicationInfrastructure = "Edge"

	ApplicationSecurityNist80053          ApplicationCategory = "NIST 800-53 Controls Mapped"
	ApplicationSecurityFips               ApplicationCategory = "FIPS Image"
	ApplicationCategoryAiMl               ApplicationCategory = "AI/ML"
	ApplicationCategoryArcade             ApplicationCategory = "Arcade"
	ApplicationCategoryCollaboration      ApplicationCategory = "Collaboration"
	ApplicationCategoryCommandAndControl  ApplicationCategory = "Command and Control"
	ApplicationCategoryDatabases          ApplicationCategory = "Databases"
	ApplicationCategoryDigitalEngineering ApplicationCategory = "DigitalEngineering"
	ApplicationCategoryITManagement       ApplicationCategory = "IT Management"
	ApplicationCategoryKubernetes         ApplicationCategory = "Kubernetes (K8s)"
	ApplicationCategoryNetworking         ApplicationCategory = "Networking"
	ApplicationCategoryProductivity       ApplicationCategory = "Productivity"
	ApplicationCategorySecurity           ApplicationCategory = "Security"
	ApplicationCategorySoftwareDev        ApplicationCategory = "Software Dev"
	ApplicationCategorySpaceOperations    ApplicationCategory = "Space Operations"
	ApplicationCategoryWeb                ApplicationCategory = "Web"
)
