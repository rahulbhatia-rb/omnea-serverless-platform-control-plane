# Architecture Notes

Omnea's platform problem is the interaction between very fast serverless scaling, stateful/data dependencies, enterprise reliability requirements, and developer velocity.

## Lambda
Lambda concurrency should be bounded against downstream capacity rather than allowed to expand independently. Reserved concurrency, queue depth, oldest-message age, Aurora saturation, and third-party quotas are useful platform signals.

## EventBridge
Events need explicit ownership, failure destinations/retry policy, schema compatibility, and visibility into delivery failures. A serverless event bus does not remove distributed-systems failure modes.

## DynamoDB
Encode access-pattern decisions, capacity mode/autoscaling, partition-key safety, backup/recovery, throttling alerts, and cost visibility.

## Aurora
The serverless application tier must not turn Aurora into an accidental global semaphore. Connection protection, query observability, failover testing, and capacity headroom matter.

## Multi-region and residency
Treat multi-region as a business requirement, not a badge. The platform contract should make customer/data classification, allowed regions, failover target, RTO/RPO, routing, and tested recovery evidence explicit.

## Developer experience
Golden paths should hide repetitive configuration while keeping important trade-offs visible. Product engineers should be able to provision and ship through reusable Pulumi components without opening platform tickets for routine work.

## Commercial view
Infrastructure decisions should connect to revenue protection and engineering throughput: deployment lead time, change-failure rate, incident diagnosis, platform support load, serverless spend, and evidence for enterprise security/residency reviews.
