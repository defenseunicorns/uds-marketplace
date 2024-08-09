// To parse this data:
//
//   import { Convert, Types } from "./file";
//
//   const types = Convert.toTypes(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface Types {
    UDSBundle:   UDSBundle;
    ZarfPackage: ZarfPackage;
}

export interface UDSBundle {
    /**
     * Generated bundle build data
     */
    build?: UDSBuildData;
    /**
     * The kind of UDS package
     */
    kind: UDSBundleKind;
    /**
     * UDSBundle metadata
     */
    metadata: UDSMetadata;
    /**
     * List of Zarf packages
     */
    packages: Package[];
}

/**
 * Generated bundle build data
 */
export interface UDSBuildData {
    /**
     * The architecture this package was created on
     */
    architecture: string;
    /**
     * The machine name that created this package
     */
    terminal: string;
    /**
     * The timestamp when this package was created
     */
    timestamp: string;
    /**
     * The username who created this package
     */
    user: string;
    /**
     * The version of Zarf used to build this package
     */
    version: string;
}

/**
 * The kind of UDS package
 */
export enum UDSBundleKind {
    UDSBundle = "UDSBundle",
}

/**
 * UDSBundle metadata
 */
export interface UDSMetadata {
    /**
     * Checksum of a checksums.txt file that contains checksums all the layers within the
     * package.
     */
    aggregateChecksum?: string;
    /**
     * The target cluster architecture for this package
     */
    architecture?: string;
    /**
     * Comma-separated list of package authors (including contact info)
     */
    authors?: string;
    /**
     * Additional information about this package
     */
    description?: string;
    /**
     * Link to package documentation when online
     */
    documentation?: string;
    /**
     * Name to identify this Zarf package
     */
    name: string;
    /**
     * Link to package source code when online
     */
    source?: string;
    /**
     * Disable compression of this package
     */
    uncompressed?: boolean;
    /**
     * Link to package information when online
     */
    url?: string;
    /**
     * Name of the distributing entity, organization or individual.
     */
    vendor?: string;
    /**
     * Generic string set by a package author to track the package version
     */
    version?: string;
}

export interface Package {
    /**
     * Description of the Zarf package
     */
    description?: string;
    /**
     * List of Zarf variables to export from the Zarf package
     */
    exports?: BundleVariableExport[];
    /**
     * Flavor of the Zarf package
     */
    flavor?: string;
    /**
     * List of Zarf variables to import from another Zarf package
     */
    imports?: BundleVariableImport[];
    name:     string;
    /**
     * List of optional components to include from the package (required components are always
     * included)
     */
    optionalComponents?: string[];
    /**
     * Map of Helm chart overrides to set. The format is <component>:
     */
    overrides?: { [key: string]: { [key: string]: BundleChartOverrides } };
    /**
     * The local path to import the package from
     */
    path?: string;
    /**
     * The public key to use to verify the package
     */
    publicKey?: string;
    /**
     * Ref (tag) of the Zarf package
     */
    ref: string;
    /**
     * The repository to import the package from
     */
    repository?: string;
}

export interface BundleVariableExport {
    description?: string;
    name:         string;
}

export interface BundleVariableImport {
    description?: string;
    name:         string;
    package:      string;
}

export interface BundleChartOverrides {
    /**
     * The namespace to deploy the Helm chart to
     */
    namespace?: string;
    /**
     * List of Helm chart values to set statically
     */
    values?: BundleChartValue[];
    /**
     * List of Helm chart value file  paths to set statically
     */
    valuesFiles?: string[];
    /**
     * List of Helm chart variables to set via UDS variables
     */
    variables?: BundleChartVariable[];
}

export interface BundleChartValue {
    path:  string;
    value: any[] | boolean | number | number | { [key: string]: any } | null | string;
}

export interface BundleChartVariable {
    default?:     any[] | boolean | number | number | { [key: string]: any } | null | string;
    description?: string;
    name:         string;
    path:         string;
    /**
     * Where the value is set from
     */
    source?: string;
    /**
     * The type of value to be processed
     */
    type?: Type;
}

/**
 * The type of value to be processed
 *
 * Changes the handling of a variable to load contents differently (i.e. from a file rather
 * than as a raw variable - templated files should be kept below 1 MiB)
 */
export enum Type {
    File = "file",
    Raw = "raw",
}

export interface ZarfPackage {
    apiVersion?: APIVersion;
    build?:      ZarfBuildData;
    components:  ZarfComponent[];
    constants?:  Constant[];
    kind:        ZarfPackageKind;
    metadata?:   ZarfMetadata;
    variables?:  InteractiveVariable[];
}

export enum APIVersion {
    ZarfDevV1Alpha1 = "zarf.dev/v1alpha1",
}

export interface ZarfBuildData {
    architecture:                string;
    differential?:               boolean;
    differentialMissing?:        string[];
    differentialPackageVersion?: string;
    flavor?:                     string;
    lastNonBreakingVersion?:     string;
    migrations?:                 string[];
    registryOverrides?:          { [key: string]: string };
    terminal:                    string;
    timestamp:                   string;
    user:                        string;
    version:                     string;
}

export interface ZarfComponent {
    actions?:        ZarfComponentActions;
    charts?:         ZarfChart[];
    cosignKeyPath?:  string;
    dataInjections?: ZarfDataInjection[];
    default?:        boolean;
    description?:    string;
    extensions?:     ZarfComponentExtensions;
    files?:          ZarfFile[];
    group?:          string;
    images?:         string[];
    import?:         ZarfComponentImport;
    manifests?:      ZarfManifest[];
    name:            string;
    only?:           ZarfComponentOnlyTarget;
    repos?:          string[];
    required?:       boolean;
    scripts?:        DeprecatedZarfComponentScripts;
}

export interface ZarfComponentActions {
    onCreate?: ZarfComponentActionSet;
    onDeploy?: ZarfComponentActionSet;
    onRemove?: ZarfComponentActionSet;
}

export interface ZarfComponentActionSet {
    after?:     ZarfComponentAction[];
    before?:    ZarfComponentAction[];
    defaults?:  ZarfComponentActionDefaults;
    onFailure?: ZarfComponentAction[];
    onSuccess?: ZarfComponentAction[];
}

export interface ZarfComponentAction {
    cmd?:             string;
    description?:     string;
    dir?:             string;
    env?:             string[];
    maxRetries?:      number;
    maxTotalSeconds?: number;
    mute?:            boolean;
    setVariable?:     string;
    setVariables?:    Variable[];
    shell?:           Shell;
    wait?:            ZarfComponentActionWait;
}

export interface Variable {
    /**
     * Whether to automatically indent the variable's value (if multiline) when templating.
     * Based on the number of chars before the start of ###ZARF_VAR_.
     */
    autoIndent?: boolean;
    /**
     * The name to be used for the variable
     */
    name: string;
    /**
     * An optional regex pattern that a variable value must match before a package deployment
     * can continue.
     */
    pattern?: string;
    /**
     * Whether to mark this variable as sensitive to not print it in the log
     */
    sensitive?: boolean;
    /**
     * Changes the handling of a variable to load contents differently (i.e. from a file rather
     * than as a raw variable - templated files should be kept below 1 MiB)
     */
    type?: Type;
}

export interface Shell {
    /**
     * (default 'sh') Indicates a preference for the shell to use on macOS systems
     */
    darwin?: string;
    /**
     * (default 'sh') Indicates a preference for the shell to use on Linux systems
     */
    linux?: string;
    /**
     * (default 'powershell') Indicates a preference for the shell to use on Windows systems
     * (note that choosing 'cmd' will turn off migrations like touch -> New-Item)
     */
    windows?: string;
}

export interface ZarfComponentActionWait {
    cluster?: ZarfComponentActionWaitCluster;
    network?: ZarfComponentActionWaitNetwork;
}

export interface ZarfComponentActionWaitCluster {
    condition?: string;
    kind:       string;
    name:       string;
    namespace?: string;
}

export interface ZarfComponentActionWaitNetwork {
    address:  string;
    code?:    number;
    protocol: Protocol;
}

export enum Protocol {
    HTTP = "http",
    HTTPS = "https",
    TCP = "tcp",
}

export interface ZarfComponentActionDefaults {
    dir?:             string;
    env?:             string[];
    maxRetries?:      number;
    maxTotalSeconds?: number;
    mute?:            boolean;
    shell?:           Shell;
}

export interface ZarfChart {
    gitPath?:     string;
    localPath?:   string;
    name:         string;
    namespace?:   string;
    noWait?:      boolean;
    releaseName?: string;
    repoName?:    string;
    url?:         string;
    valuesFiles?: string[];
    variables?:   ZarfChartVariable[];
    version?:     string;
}

export interface ZarfChartVariable {
    description: string;
    name:        string;
    path:        string;
}

export interface ZarfDataInjection {
    compress?: boolean;
    source:    string;
    target:    ZarfContainerTarget;
}

export interface ZarfContainerTarget {
    container: string;
    namespace: string;
    path:      string;
    selector:  string;
}

export interface ZarfComponentExtensions {
    bigbang?: BigBang;
}

export interface BigBang {
    fluxPatchFiles?: string[];
    repo?:           string;
    skipFlux?:       boolean;
    valuesFiles?:    string[];
    version:         string;
}

export interface ZarfFile {
    executable?:  boolean;
    extractPath?: string;
    shasum?:      string;
    source:       string;
    symlinks?:    string[];
    target:       string;
}

export interface ZarfComponentImport {
    name?: string;
    path?: string;
    url?:  string;
}

export interface ZarfManifest {
    files?:                      string[];
    kustomizations?:             string[];
    kustomizeAllowAnyDirectory?: boolean;
    name:                        string;
    namespace?:                  string;
    noWait?:                     boolean;
}

export interface ZarfComponentOnlyTarget {
    cluster?: ZarfComponentOnlyCluster;
    flavor?:  string;
    localOS?: LocalOS;
}

export interface ZarfComponentOnlyCluster {
    architecture?: Architecture;
    distros?:      string[];
}

export enum Architecture {
    Amd64 = "amd64",
    Arm64 = "arm64",
}

export enum LocalOS {
    Darwin = "darwin",
    Linux = "linux",
    Windows = "windows",
}

export interface DeprecatedZarfComponentScripts {
    after?:          string[];
    before?:         string[];
    prepare?:        string[];
    retry?:          boolean;
    showOutput?:     boolean;
    timeoutSeconds?: number;
}

export interface Constant {
    /**
     * Whether to automatically indent the variable's value (if multiline) when templating.
     * Based on the number of chars before the start of ###ZARF_CONST_.
     */
    autoIndent?: boolean;
    /**
     * A description of the constant to explain its purpose on package create or deploy
     * confirmation prompts
     */
    description?: string;
    /**
     * The name to be used for the constant
     */
    name: string;
    /**
     * An optional regex pattern that a constant value must match before a package can be
     * created.
     */
    pattern?: string;
    /**
     * The value to set for the constant during deploy
     */
    value: string;
}

export enum ZarfPackageKind {
    ZarfInitConfig = "ZarfInitConfig",
    ZarfPackageConfig = "ZarfPackageConfig",
}

export interface ZarfMetadata {
    aggregateChecksum?: string;
    architecture?:      string;
    authors?:           string;
    description?:       string;
    documentation?:     string;
    image?:             string;
    name:               string;
    source?:            string;
    uncompressed?:      boolean;
    url?:               string;
    vendor?:            string;
    version?:           string;
    yolo?:              boolean;
}

export interface InteractiveVariable {
    /**
     * The default value to use for the variable
     */
    default?: string;
    /**
     * A description of the variable to be used when prompting the user a value
     */
    description?: string;
    /**
     * Whether to prompt the user for input for this variable
     */
    prompt?:  boolean;
    Variable: Variable;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toTypes(json: string): Types {
        return cast(JSON.parse(json), r("Types"));
    }

    public static typesToJson(value: Types): string {
        return JSON.stringify(uncast(value, r("Types")), null, 2);
    }
}

function invalidValue(typ: any, val: any, key: any, parent: any = ''): never {
    const prettyTyp = prettyTypeName(typ);
    const parentText = parent ? ` on ${parent}` : '';
    const keyText = key ? ` for key "${key}"` : '';
    throw Error(`Invalid value${keyText}${parentText}. Expected ${prettyTyp} but got ${JSON.stringify(val)}`);
}

function prettyTypeName(typ: any): string {
    if (Array.isArray(typ)) {
        if (typ.length === 2 && typ[0] === undefined) {
            return `an optional ${prettyTypeName(typ[1])}`;
        } else {
            return `one of [${typ.map(a => { return prettyTypeName(a); }).join(", ")}]`;
        }
    } else if (typeof typ === "object" && typ.literal !== undefined) {
        return typ.literal;
    } else {
        return typeof typ;
    }
}

function jsonToJSProps(typ: any): any {
    if (typ.jsonToJS === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.json] = { key: p.js, typ: p.typ });
        typ.jsonToJS = map;
    }
    return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
    if (typ.jsToJSON === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.js] = { key: p.json, typ: p.typ });
        typ.jsToJSON = map;
    }
    return typ.jsToJSON;
}

function transform(val: any, typ: any, getProps: any, key: any = '', parent: any = ''): any {
    function transformPrimitive(typ: string, val: any): any {
        if (typeof typ === typeof val) return val;
        return invalidValue(typ, val, key, parent);
    }

    function transformUnion(typs: any[], val: any): any {
        // val must validate against one typ in typs
        const l = typs.length;
        for (let i = 0; i < l; i++) {
            const typ = typs[i];
            try {
                return transform(val, typ, getProps);
            } catch (_) {}
        }
        return invalidValue(typs, val, key, parent);
    }

    function transformEnum(cases: string[], val: any): any {
        if (cases.indexOf(val) !== -1) return val;
        return invalidValue(cases.map(a => { return l(a); }), val, key, parent);
    }

    function transformArray(typ: any, val: any): any {
        // val must be an array with no invalid elements
        if (!Array.isArray(val)) return invalidValue(l("array"), val, key, parent);
        return val.map(el => transform(el, typ, getProps));
    }

    function transformDate(val: any): any {
        if (val === null) {
            return null;
        }
        const d = new Date(val);
        if (isNaN(d.valueOf())) {
            return invalidValue(l("Date"), val, key, parent);
        }
        return d;
    }

    function transformObject(props: { [k: string]: any }, additional: any, val: any): any {
        if (val === null || typeof val !== "object" || Array.isArray(val)) {
            return invalidValue(l(ref || "object"), val, key, parent);
        }
        const result: any = {};
        Object.getOwnPropertyNames(props).forEach(key => {
            const prop = props[key];
            const v = Object.prototype.hasOwnProperty.call(val, key) ? val[key] : undefined;
            result[prop.key] = transform(v, prop.typ, getProps, key, ref);
        });
        Object.getOwnPropertyNames(val).forEach(key => {
            if (!Object.prototype.hasOwnProperty.call(props, key)) {
                result[key] = transform(val[key], additional, getProps, key, ref);
            }
        });
        return result;
    }

    if (typ === "any") return val;
    if (typ === null) {
        if (val === null) return val;
        return invalidValue(typ, val, key, parent);
    }
    if (typ === false) return invalidValue(typ, val, key, parent);
    let ref: any = undefined;
    while (typeof typ === "object" && typ.ref !== undefined) {
        ref = typ.ref;
        typ = typeMap[typ.ref];
    }
    if (Array.isArray(typ)) return transformEnum(typ, val);
    if (typeof typ === "object") {
        return typ.hasOwnProperty("unionMembers") ? transformUnion(typ.unionMembers, val)
            : typ.hasOwnProperty("arrayItems")    ? transformArray(typ.arrayItems, val)
            : typ.hasOwnProperty("props")         ? transformObject(getProps(typ), typ.additional, val)
            : invalidValue(typ, val, key, parent);
    }
    // Numbers can be parsed by Date but shouldn't be.
    if (typ === Date && typeof val !== "number") return transformDate(val);
    return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
    return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
    return transform(val, typ, jsToJSONProps);
}

function l(typ: any) {
    return { literal: typ };
}

function a(typ: any) {
    return { arrayItems: typ };
}

function u(...typs: any[]) {
    return { unionMembers: typs };
}

function o(props: any[], additional: any) {
    return { props, additional };
}

function m(additional: any) {
    return { props: [], additional };
}

function r(name: string) {
    return { ref: name };
}

const typeMap: any = {
    "Types": o([
        { json: "UDSBundle", js: "UDSBundle", typ: r("UDSBundle") },
        { json: "ZarfPackage", js: "ZarfPackage", typ: r("ZarfPackage") },
    ], false),
    "UDSBundle": o([
        { json: "build", js: "build", typ: u(undefined, r("UDSBuildData")) },
        { json: "kind", js: "kind", typ: r("UDSBundleKind") },
        { json: "metadata", js: "metadata", typ: r("UDSMetadata") },
        { json: "packages", js: "packages", typ: a(r("Package")) },
    ], false),
    "UDSBuildData": o([
        { json: "architecture", js: "architecture", typ: "" },
        { json: "terminal", js: "terminal", typ: "" },
        { json: "timestamp", js: "timestamp", typ: "" },
        { json: "user", js: "user", typ: "" },
        { json: "version", js: "version", typ: "" },
    ], false),
    "UDSMetadata": o([
        { json: "aggregateChecksum", js: "aggregateChecksum", typ: u(undefined, "") },
        { json: "architecture", js: "architecture", typ: u(undefined, "") },
        { json: "authors", js: "authors", typ: u(undefined, "") },
        { json: "description", js: "description", typ: u(undefined, "") },
        { json: "documentation", js: "documentation", typ: u(undefined, "") },
        { json: "name", js: "name", typ: "" },
        { json: "source", js: "source", typ: u(undefined, "") },
        { json: "uncompressed", js: "uncompressed", typ: u(undefined, true) },
        { json: "url", js: "url", typ: u(undefined, "") },
        { json: "vendor", js: "vendor", typ: u(undefined, "") },
        { json: "version", js: "version", typ: u(undefined, "") },
    ], false),
    "Package": o([
        { json: "description", js: "description", typ: u(undefined, "") },
        { json: "exports", js: "exports", typ: u(undefined, a(r("BundleVariableExport"))) },
        { json: "flavor", js: "flavor", typ: u(undefined, "") },
        { json: "imports", js: "imports", typ: u(undefined, a(r("BundleVariableImport"))) },
        { json: "name", js: "name", typ: "" },
        { json: "optionalComponents", js: "optionalComponents", typ: u(undefined, a("")) },
        { json: "overrides", js: "overrides", typ: u(undefined, m(m(r("BundleChartOverrides")))) },
        { json: "path", js: "path", typ: u(undefined, "") },
        { json: "publicKey", js: "publicKey", typ: u(undefined, "") },
        { json: "ref", js: "ref", typ: "" },
        { json: "repository", js: "repository", typ: u(undefined, "") },
    ], false),
    "BundleVariableExport": o([
        { json: "description", js: "description", typ: u(undefined, "") },
        { json: "name", js: "name", typ: "" },
    ], false),
    "BundleVariableImport": o([
        { json: "description", js: "description", typ: u(undefined, "") },
        { json: "name", js: "name", typ: "" },
        { json: "package", js: "package", typ: "" },
    ], false),
    "BundleChartOverrides": o([
        { json: "namespace", js: "namespace", typ: u(undefined, "") },
        { json: "values", js: "values", typ: u(undefined, a(r("BundleChartValue"))) },
        { json: "valuesFiles", js: "valuesFiles", typ: u(undefined, a("")) },
        { json: "variables", js: "variables", typ: u(undefined, a(r("BundleChartVariable"))) },
    ], false),
    "BundleChartValue": o([
        { json: "path", js: "path", typ: "" },
        { json: "value", js: "value", typ: u(a("any"), true, 3.14, 0, m("any"), null, "") },
    ], false),
    "BundleChartVariable": o([
        { json: "default", js: "default", typ: u(undefined, u(a("any"), true, 3.14, 0, m("any"), null, "")) },
        { json: "description", js: "description", typ: u(undefined, "") },
        { json: "name", js: "name", typ: "" },
        { json: "path", js: "path", typ: "" },
        { json: "source", js: "source", typ: u(undefined, "") },
        { json: "type", js: "type", typ: u(undefined, r("Type")) },
    ], false),
    "ZarfPackage": o([
        { json: "apiVersion", js: "apiVersion", typ: u(undefined, r("APIVersion")) },
        { json: "build", js: "build", typ: u(undefined, r("ZarfBuildData")) },
        { json: "components", js: "components", typ: a(r("ZarfComponent")) },
        { json: "constants", js: "constants", typ: u(undefined, a(r("Constant"))) },
        { json: "kind", js: "kind", typ: r("ZarfPackageKind") },
        { json: "metadata", js: "metadata", typ: u(undefined, r("ZarfMetadata")) },
        { json: "variables", js: "variables", typ: u(undefined, a(r("InteractiveVariable"))) },
    ], false),
    "ZarfBuildData": o([
        { json: "architecture", js: "architecture", typ: "" },
        { json: "differential", js: "differential", typ: u(undefined, true) },
        { json: "differentialMissing", js: "differentialMissing", typ: u(undefined, a("")) },
        { json: "differentialPackageVersion", js: "differentialPackageVersion", typ: u(undefined, "") },
        { json: "flavor", js: "flavor", typ: u(undefined, "") },
        { json: "lastNonBreakingVersion", js: "lastNonBreakingVersion", typ: u(undefined, "") },
        { json: "migrations", js: "migrations", typ: u(undefined, a("")) },
        { json: "registryOverrides", js: "registryOverrides", typ: u(undefined, m("")) },
        { json: "terminal", js: "terminal", typ: "" },
        { json: "timestamp", js: "timestamp", typ: "" },
        { json: "user", js: "user", typ: "" },
        { json: "version", js: "version", typ: "" },
    ], false),
    "ZarfComponent": o([
        { json: "actions", js: "actions", typ: u(undefined, r("ZarfComponentActions")) },
        { json: "charts", js: "charts", typ: u(undefined, a(r("ZarfChart"))) },
        { json: "cosignKeyPath", js: "cosignKeyPath", typ: u(undefined, "") },
        { json: "dataInjections", js: "dataInjections", typ: u(undefined, a(r("ZarfDataInjection"))) },
        { json: "default", js: "default", typ: u(undefined, true) },
        { json: "description", js: "description", typ: u(undefined, "") },
        { json: "extensions", js: "extensions", typ: u(undefined, r("ZarfComponentExtensions")) },
        { json: "files", js: "files", typ: u(undefined, a(r("ZarfFile"))) },
        { json: "group", js: "group", typ: u(undefined, "") },
        { json: "images", js: "images", typ: u(undefined, a("")) },
        { json: "import", js: "import", typ: u(undefined, r("ZarfComponentImport")) },
        { json: "manifests", js: "manifests", typ: u(undefined, a(r("ZarfManifest"))) },
        { json: "name", js: "name", typ: "" },
        { json: "only", js: "only", typ: u(undefined, r("ZarfComponentOnlyTarget")) },
        { json: "repos", js: "repos", typ: u(undefined, a("")) },
        { json: "required", js: "required", typ: u(undefined, true) },
        { json: "scripts", js: "scripts", typ: u(undefined, r("DeprecatedZarfComponentScripts")) },
    ], false),
    "ZarfComponentActions": o([
        { json: "onCreate", js: "onCreate", typ: u(undefined, r("ZarfComponentActionSet")) },
        { json: "onDeploy", js: "onDeploy", typ: u(undefined, r("ZarfComponentActionSet")) },
        { json: "onRemove", js: "onRemove", typ: u(undefined, r("ZarfComponentActionSet")) },
    ], false),
    "ZarfComponentActionSet": o([
        { json: "after", js: "after", typ: u(undefined, a(r("ZarfComponentAction"))) },
        { json: "before", js: "before", typ: u(undefined, a(r("ZarfComponentAction"))) },
        { json: "defaults", js: "defaults", typ: u(undefined, r("ZarfComponentActionDefaults")) },
        { json: "onFailure", js: "onFailure", typ: u(undefined, a(r("ZarfComponentAction"))) },
        { json: "onSuccess", js: "onSuccess", typ: u(undefined, a(r("ZarfComponentAction"))) },
    ], false),
    "ZarfComponentAction": o([
        { json: "cmd", js: "cmd", typ: u(undefined, "") },
        { json: "description", js: "description", typ: u(undefined, "") },
        { json: "dir", js: "dir", typ: u(undefined, "") },
        { json: "env", js: "env", typ: u(undefined, a("")) },
        { json: "maxRetries", js: "maxRetries", typ: u(undefined, 0) },
        { json: "maxTotalSeconds", js: "maxTotalSeconds", typ: u(undefined, 0) },
        { json: "mute", js: "mute", typ: u(undefined, true) },
        { json: "setVariable", js: "setVariable", typ: u(undefined, "") },
        { json: "setVariables", js: "setVariables", typ: u(undefined, a(r("Variable"))) },
        { json: "shell", js: "shell", typ: u(undefined, r("Shell")) },
        { json: "wait", js: "wait", typ: u(undefined, r("ZarfComponentActionWait")) },
    ], false),
    "Variable": o([
        { json: "autoIndent", js: "autoIndent", typ: u(undefined, true) },
        { json: "name", js: "name", typ: "" },
        { json: "pattern", js: "pattern", typ: u(undefined, "") },
        { json: "sensitive", js: "sensitive", typ: u(undefined, true) },
        { json: "type", js: "type", typ: u(undefined, r("Type")) },
    ], false),
    "Shell": o([
        { json: "darwin", js: "darwin", typ: u(undefined, "") },
        { json: "linux", js: "linux", typ: u(undefined, "") },
        { json: "windows", js: "windows", typ: u(undefined, "") },
    ], false),
    "ZarfComponentActionWait": o([
        { json: "cluster", js: "cluster", typ: u(undefined, r("ZarfComponentActionWaitCluster")) },
        { json: "network", js: "network", typ: u(undefined, r("ZarfComponentActionWaitNetwork")) },
    ], false),
    "ZarfComponentActionWaitCluster": o([
        { json: "condition", js: "condition", typ: u(undefined, "") },
        { json: "kind", js: "kind", typ: "" },
        { json: "name", js: "name", typ: "" },
        { json: "namespace", js: "namespace", typ: u(undefined, "") },
    ], false),
    "ZarfComponentActionWaitNetwork": o([
        { json: "address", js: "address", typ: "" },
        { json: "code", js: "code", typ: u(undefined, 0) },
        { json: "protocol", js: "protocol", typ: r("Protocol") },
    ], false),
    "ZarfComponentActionDefaults": o([
        { json: "dir", js: "dir", typ: u(undefined, "") },
        { json: "env", js: "env", typ: u(undefined, a("")) },
        { json: "maxRetries", js: "maxRetries", typ: u(undefined, 0) },
        { json: "maxTotalSeconds", js: "maxTotalSeconds", typ: u(undefined, 0) },
        { json: "mute", js: "mute", typ: u(undefined, true) },
        { json: "shell", js: "shell", typ: u(undefined, r("Shell")) },
    ], false),
    "ZarfChart": o([
        { json: "gitPath", js: "gitPath", typ: u(undefined, "") },
        { json: "localPath", js: "localPath", typ: u(undefined, "") },
        { json: "name", js: "name", typ: "" },
        { json: "namespace", js: "namespace", typ: u(undefined, "") },
        { json: "noWait", js: "noWait", typ: u(undefined, true) },
        { json: "releaseName", js: "releaseName", typ: u(undefined, "") },
        { json: "repoName", js: "repoName", typ: u(undefined, "") },
        { json: "url", js: "url", typ: u(undefined, "") },
        { json: "valuesFiles", js: "valuesFiles", typ: u(undefined, a("")) },
        { json: "variables", js: "variables", typ: u(undefined, a(r("ZarfChartVariable"))) },
        { json: "version", js: "version", typ: u(undefined, "") },
    ], false),
    "ZarfChartVariable": o([
        { json: "description", js: "description", typ: "" },
        { json: "name", js: "name", typ: "" },
        { json: "path", js: "path", typ: "" },
    ], false),
    "ZarfDataInjection": o([
        { json: "compress", js: "compress", typ: u(undefined, true) },
        { json: "source", js: "source", typ: "" },
        { json: "target", js: "target", typ: r("ZarfContainerTarget") },
    ], false),
    "ZarfContainerTarget": o([
        { json: "container", js: "container", typ: "" },
        { json: "namespace", js: "namespace", typ: "" },
        { json: "path", js: "path", typ: "" },
        { json: "selector", js: "selector", typ: "" },
    ], false),
    "ZarfComponentExtensions": o([
        { json: "bigbang", js: "bigbang", typ: u(undefined, r("BigBang")) },
    ], false),
    "BigBang": o([
        { json: "fluxPatchFiles", js: "fluxPatchFiles", typ: u(undefined, a("")) },
        { json: "repo", js: "repo", typ: u(undefined, "") },
        { json: "skipFlux", js: "skipFlux", typ: u(undefined, true) },
        { json: "valuesFiles", js: "valuesFiles", typ: u(undefined, a("")) },
        { json: "version", js: "version", typ: "" },
    ], false),
    "ZarfFile": o([
        { json: "executable", js: "executable", typ: u(undefined, true) },
        { json: "extractPath", js: "extractPath", typ: u(undefined, "") },
        { json: "shasum", js: "shasum", typ: u(undefined, "") },
        { json: "source", js: "source", typ: "" },
        { json: "symlinks", js: "symlinks", typ: u(undefined, a("")) },
        { json: "target", js: "target", typ: "" },
    ], false),
    "ZarfComponentImport": o([
        { json: "name", js: "name", typ: u(undefined, "") },
        { json: "path", js: "path", typ: u(undefined, "") },
        { json: "url", js: "url", typ: u(undefined, "") },
    ], false),
    "ZarfManifest": o([
        { json: "files", js: "files", typ: u(undefined, a("")) },
        { json: "kustomizations", js: "kustomizations", typ: u(undefined, a("")) },
        { json: "kustomizeAllowAnyDirectory", js: "kustomizeAllowAnyDirectory", typ: u(undefined, true) },
        { json: "name", js: "name", typ: "" },
        { json: "namespace", js: "namespace", typ: u(undefined, "") },
        { json: "noWait", js: "noWait", typ: u(undefined, true) },
    ], false),
    "ZarfComponentOnlyTarget": o([
        { json: "cluster", js: "cluster", typ: u(undefined, r("ZarfComponentOnlyCluster")) },
        { json: "flavor", js: "flavor", typ: u(undefined, "") },
        { json: "localOS", js: "localOS", typ: u(undefined, r("LocalOS")) },
    ], false),
    "ZarfComponentOnlyCluster": o([
        { json: "architecture", js: "architecture", typ: u(undefined, r("Architecture")) },
        { json: "distros", js: "distros", typ: u(undefined, a("")) },
    ], false),
    "DeprecatedZarfComponentScripts": o([
        { json: "after", js: "after", typ: u(undefined, a("")) },
        { json: "before", js: "before", typ: u(undefined, a("")) },
        { json: "prepare", js: "prepare", typ: u(undefined, a("")) },
        { json: "retry", js: "retry", typ: u(undefined, true) },
        { json: "showOutput", js: "showOutput", typ: u(undefined, true) },
        { json: "timeoutSeconds", js: "timeoutSeconds", typ: u(undefined, 0) },
    ], false),
    "Constant": o([
        { json: "autoIndent", js: "autoIndent", typ: u(undefined, true) },
        { json: "description", js: "description", typ: u(undefined, "") },
        { json: "name", js: "name", typ: "" },
        { json: "pattern", js: "pattern", typ: u(undefined, "") },
        { json: "value", js: "value", typ: "" },
    ], false),
    "ZarfMetadata": o([
        { json: "aggregateChecksum", js: "aggregateChecksum", typ: u(undefined, "") },
        { json: "architecture", js: "architecture", typ: u(undefined, "") },
        { json: "authors", js: "authors", typ: u(undefined, "") },
        { json: "description", js: "description", typ: u(undefined, "") },
        { json: "documentation", js: "documentation", typ: u(undefined, "") },
        { json: "image", js: "image", typ: u(undefined, "") },
        { json: "name", js: "name", typ: "" },
        { json: "source", js: "source", typ: u(undefined, "") },
        { json: "uncompressed", js: "uncompressed", typ: u(undefined, true) },
        { json: "url", js: "url", typ: u(undefined, "") },
        { json: "vendor", js: "vendor", typ: u(undefined, "") },
        { json: "version", js: "version", typ: u(undefined, "") },
        { json: "yolo", js: "yolo", typ: u(undefined, true) },
    ], false),
    "InteractiveVariable": o([
        { json: "default", js: "default", typ: u(undefined, "") },
        { json: "description", js: "description", typ: u(undefined, "") },
        { json: "prompt", js: "prompt", typ: u(undefined, true) },
        { json: "Variable", js: "Variable", typ: r("Variable") },
    ], false),
    "UDSBundleKind": [
        "UDSBundle",
    ],
    "Type": [
        "file",
        "raw",
    ],
    "APIVersion": [
        "zarf.dev/v1alpha1",
    ],
    "Protocol": [
        "http",
        "https",
        "tcp",
    ],
    "Architecture": [
        "amd64",
        "arm64",
    ],
    "LocalOS": [
        "darwin",
        "linux",
        "windows",
    ],
    "ZarfPackageKind": [
        "ZarfInitConfig",
        "ZarfPackageConfig",
    ],
};
