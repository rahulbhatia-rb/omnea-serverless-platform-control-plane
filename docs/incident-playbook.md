# Serverless Incident Playbook

1. Identify affected customer workflow and region.
2. Correlate the incident with deployments using Datadog deployment markers.
3. Inspect Lambda errors, throttles, concurrency, duration, and retry behavior.
4. Inspect EventBridge failed deliveries and asynchronous backlog age.
5. Inspect DynamoDB throttles/hot partitions and Aurora connections/latency/saturation.
6. Determine whether failure is release, dependency, quota, regional, data, or capacity related.
7. Roll back a bad deployment when evidence supports it.
8. Apply backpressure before indiscriminately scaling stateless compute.
9. Verify residency constraints before regional failover.
10. Validate recovery against the SLO and customer-impact signal.
11. Turn repeated manual mitigation into a platform guardrail or reusable component.
