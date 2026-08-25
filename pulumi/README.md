# Pulumi Component Direction

This repository intentionally does not pretend to know Omnea's internal AWS topology.

A production implementation would expose reusable TypeScript components for common workload shapes, for example:

- Lambda + IAM + logs + alarms + concurrency controls
- EventBridge rule/bus + DLQ/retry policy + ownership
- DynamoDB table + backup + alarms + capacity defaults
- Aurora access + workload identity/secrets + connection protection
- Datadog monitors/SLO/service catalog metadata
- regional/residency policy metadata

The key design principle is to put safe defaults and observability into the component interface so product teams do not need to bolt them on later.
