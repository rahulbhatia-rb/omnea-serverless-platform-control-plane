# Omnea Serverless Platform Control Plane

Independent proof-of-work inspired by Omnea's Platform Engineer role.

This project models the production-readiness contract I would want around a fast-growing, enterprise-facing, serverless SaaS platform running on AWS with Pulumi, TypeScript, GitHub Actions, and Datadog.

The goal is not to guess Omnea's private architecture. It is to show how I think about the platform outcomes in the role: ship multiple times a day, preserve reliability through 10x growth, support multi-region/data-residency constraints, and make the paved road easier than the unsafe road.

## Core idea

```text
Product engineer change
        |
        v
GitHub Actions
        |
        +--> type/test/security checks
        |
        +--> Pulumi preview
        |
        v
Platform readiness gate
        |
      allow / deny
        |
        v
Progressive deploy
        |
        +--> Lambda / EventBridge
        +--> DynamoDB
        +--> Aurora
        |
        v
Datadog validation + rollback
```

## What the gate checks

### Serverless scale
- Lambda concurrency is bounded against downstream capacity
- asynchronous workloads have queue/backpressure controls
- DynamoDB capacity mode or autoscaling is explicit
- Aurora connection protection is enabled
- capacity headroom is owned and reviewed

### Multi-region and data residency
- recovery region is defined
- RTO and RPO are explicit
- failover has been tested
- residency classification exists for customer data
- regional routing cannot silently violate residency requirements

### Delivery
- GitHub Actions pipeline exists
- Pulumi preview is required before apply
- progressive rollout is enabled
- automatic rollback exists
- production validation is defined
- rollback ownership is explicit

### Observability
- logs, metrics and traces are present
- Datadog service ownership is defined
- SLOs and burn-rate alerting exist
- customer-impact signal is included
- deployment markers are available for debugging

### Security / enterprise readiness
- workload identity / least privilege
- managed secrets
- encryption at rest and in transit
- audit evidence
- dependency and container scanning
- break-glass access is controlled
- security owner is explicit

### Developer experience
- reusable platform component exists
- self-service workflow exists
- documentation is linked
- feedback-loop latency is measured
- exception paths have owner + expiry

### Commercial / cost controls
- cost owner
- cost-per-workload signal
- budget/forecast threshold
- serverless spend anomalies observable
- architecture trade-off documented

## Why this maps to Omnea

Omnea's role combines four problems that are easy to optimize independently and hard to optimize together:

1. **Deploy very frequently**
2. **Scale serverless systems by an order of magnitude**
3. **Meet enterprise reliability, security, residency, and architecture requirements**
4. **Keep developer experience and cloud cost under control**

The important platform decision is not "how do we add more controls?" It is "how do we encode the right controls into the default delivery path so product engineers can move faster because the platform is safe, not despite it?"

## Example scenarios

`examples/production-platform.json` describes a platform contract that is safe to ship.

`examples/unsafe-platform.json` deliberately violates reliability, residency, security, observability, delivery, and DX requirements.

## Run locally

Node 22+ can execute the TypeScript directly:

```bash
node --experimental-strip-types --test tests/gate.test.ts
```

Run the examples:

```bash
node --experimental-strip-types src/cli.ts examples/production-platform.json
node --experimental-strip-types src/cli.ts examples/unsafe-platform.json
```

## Example output

Safe:

```text
READY
```

Unsafe:

```text
BLOCKED
- Pulumi preview is required
- failover must be tested
- residency classification is required
...
```

## Architecture trade-offs

### Lambda scaling vs downstream protection

Lambda can scale faster than Aurora, third-party APIs, or downstream consumers can safely absorb load. Reserved concurrency, queueing, backpressure, and service-level limits should be treated as reliability controls rather than arbitrary throttles.

### Multi-region vs complexity

Not every workload needs active-active multi-region. The contract requires an explicit recovery strategy, tested failover, RTO/RPO, and residency controls. The architecture can then choose active-passive, regional isolation, or active-active based on business requirements.

### DynamoDB vs Aurora

The platform should make the trade-off visible rather than ideological:
- DynamoDB for access patterns that benefit from predictable key-value/serverless scaling.
- Aurora when relational semantics and querying justify the operational cost.
- Both need capacity, observability, backup/recovery, and cost ownership.

### Guardrails vs velocity

A platform gate is useful only if the safe path is also the fast path. Exceptions should exist, but they should be owned, time-bounded, and observable.

## 30 / 60 / 90 direction

### 0-30 days
- map the highest-friction deployment and debugging paths
- baseline Lambda concurrency, Aurora saturation, DynamoDB throttles, EventBridge failures, and deployment lead time
- inventory Pulumi ownership and environment drift
- map SLOs, alert quality, incident history, residency requirements, and top cloud-cost drivers
- identify repeated manual work performed by product engineers

### 31-60 days
- standardize reusable Pulumi components and golden paths
- tighten GitHub Actions feedback loops and progressive delivery
- establish downstream-aware Lambda concurrency and queue/backpressure patterns
- improve Datadog service ownership, deployment markers, SLOs, and incident context
- run multi-region recovery/data-residency exercises

### 61-90 days
- automate production-readiness and exception checks
- reduce manual platform tickets through self-service workflows
- add cost-per-workload and anomaly visibility
- test failure modes around regional loss, database saturation, event backlog, and bad deploys
- measure platform adoption and developer feedback-loop improvement

## What I would measure

Platform uptime alone is not enough.

I would track:
- deployment frequency
- deployment failure / rollback rate
- lead time from merge to production
- platform support requests per engineer
- CI feedback latency
- SLO burn
- MTTR
- Lambda throttling and concurrency saturation
- Aurora connection/saturation signals
- DynamoDB throttles
- EventBridge delivery failures
- cost per workload / customer / environment where appropriate
- golden-path adoption
- exception count and age

## Disclaimer

This is an independent engineering prototype based only on the public job description. It does not represent Omnea's private architecture, customer data model, security controls, or production environment.
