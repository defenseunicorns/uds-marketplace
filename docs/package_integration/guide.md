---
title: Integrator's Guide
type: docs
weight: 5
---

# UDS Marketplace Package Integration Guide

## Introduction

This guide is intended for developers integrating applications with UDS (Unicorn Delivery Service). It provides an overview of the integration process, key considerations, and resources to ensure a smooth integration.

Integrating a Package fundamentally means:
1. Creating a repository `uds-package-<name>`
2. Integrating the upstream deployment mechanism (helm, manifests, kustomize, etc...) as a zarf package `zarf.yaml` to build a declarative OCI artifact
3. Adding a UDS package Custom Resource `uds-package.yaml` to integrate with UDS Core via Pepr
4. Build a 'zero CVE' package by replacing images with a `*-unicorn` flavored image


## Prerequisites

- UDS generally assumes applications are containerized and can be deployed via Kubernetes. (exceptions are possible, but rare and require additional work e.g. KubeVirt)
- The integrator (you) should have access to the application image and deployment code.
- The "App" should have a compatible license for UDS integration (Apache 2.0 or similar) [see Licensing Considerations](#licensing-considerations).

### Licensing Considerations

- Defense Unicorns uses Apache 2.0 licenses exclusively products, see the [Open Source Policy](https://github.com/defenseunicorns/uds-common/blob/main/docs/adrs/0002-apache-2.0-for-all-uds-products.md)
- This may exclude licenses like AGPLv3 or other copyleft licenses from being a valid choice for UDS integration.
- In other casesVendors in the marketplace will carry forward their license and associated fees.


## Getting Started

Before beginning the integration process, familiarize yourself with the following resources:

1. [UDS Capabilities Documentation](https://uds.defenseunicorns.com/capabilities/): Provides information about UDS, UDS CLI, UDS Core, and UDS Bundles.
2. [Zarf Documentation](https://docs.zarf.dev): Zarf is a tool for declarative creation & distribution of software.
3. [UDS Common Repository](https://github.com/defenseunicorns/uds-common): Contains information and best practices for UDS integration.
4. [UDS Applications Tracker](https://coda.io/d/Product_dGmk3eNjmm8/Applications_sux6H#_luFRc): Lists many backlogged and completed applications for UDS integration.
5. Briefly review [Pepr Documentation](https://docs.pepr.dev/) it may become useful when you begin integrating with UDS Core.


## Integration Checklist

When integrating an application with UDS, consider the following requirements and suggestions:

### Step 1 - Zarf Package

Your goal is to bundle the upstream deployment mechanism and images into a single Zarf package, defined in a `zarf.yaml`

*reminder https://docs.zarf.dev*

- [ ] Evaluate the application's deployment mechanism to determine the best Zarf package component (e.g., Helm, Kustomize, etc.).
- [ ] The Command `uds zarf dev generate` may be useful to generate an initial zarf.yaml file for your application.
- [ ] Identify the application's images, the command `uds zarf dev find-images` may be useful.
- [ ] The application may require additional configurations at build time or runtime, consider [Zarf Component Actions](https://docs.zarf.dev/ref/examples/component-actions/)

#### Checkout
Your repository has a `zarf.yaml`, you can build a single artifact with `uds zarf package create`, and deploy it to a [k3d-core-dev-slim cluster](https://github.com/defenseunicorns/uds-core?tab=readme-ov-file#uds-package-development) using `uds zarf package deploy`

### Step 2 - UDS Package

Your goal is to integrate the Zarf package application with [UDS Core](https://github.com/defenseunicorns/uds-core), using `uds-package.yaml` custom resource.

- [ ] If you haven't already, read the docs on [UDS Operator](https://uds.defenseunicorns.com/core/configuration/uds-operator/)


#### Istio (Networking)
- [ ] Define external interfaces under the `expose` key.
- [ ] Ensure successful deployment with Istio injection enabled.
- [ ] Avoid workarounds like disabling strict mTLS peer authentication.

#### Network Policies
- [ ] Define required network policies under the `allow` key.
- [ ] Minimize network policies to specific selectors for Ingress/Egress traffic.
- [ ] Consider templating network policy keys for flexibility.

### Keycloak (SSO Integration)
- [ ] Use the `sso` key to create a Keycloak client for end-user login.
- [ ] Implement secure defaults (e.g., SAML w/SCIM vs OIDC).
- [ ] Follow naming conventions for clients and client IDs.

### Prometheus
- [ ] Implement monitors for each application metrics endpoint.

### Exemptions
- [ ] Minimize scope and number of exemptions.
- [ ] Document rationale for any exemptions.

### Structure
- [ ] Expose configuration through a Helm chart.
- [ ] Limit use of Zarf variable templates.
- [ ] Implement multiple flavors when possible.

### Testing
- [ ] Implement Journey Testing for basic user flows.
- [ ] Implement Upgrade Testing.
- [ ] Lint configurations with appropriate tools.

### Maintenance
- [ ] Configure a dependency management bot.
- [ ] Release packages to the appropriate namespace.

### General
- [ ] Ensure capability to operate in an air-gapped environment.
- [ ] Have a resourced team explicitly defined for maintenance.

#### Checkout
Your repository has a `uds-package.yaml` manifest added to your `zarf.yaml` and you can deploy to a K3d Core Dev Slim cluster.

## Examples

For reference, consider these well-maintained UDS package examples:
- [UDS Package GitLab](https://github.com/defenseunicorns/uds-package-gitlab) (More complex example)
- [UDS Package Mattermost](https://github.com/defenseunicorns/uds-package-mattermost) (Simpler example)

## Conclusion

TODO
Questions, Comments, Confusions, Improvements?
Ask in
- #product-support `/product support` in Slack.
- #uds-marketplace in Slack.
- GitHub Issues in the XYZ repository.