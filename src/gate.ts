export type PlatformSpec = {
  owner?: string;
  infrastructure?: { iacTool?: string; pulumiPreview?: boolean; lambdaConcurrencyGuard?: boolean; asyncBackpressure?: boolean; dynamodbCapacityManaged?: boolean; auroraConnectionProtection?: boolean; capacityHeadroomPercent?: number; };
  region?: { recoveryRegion?: string; rtoMinutes?: number; rpoMinutes?: number; failoverTested?: boolean; residencyClassification?: string; residencySafeRouting?: boolean; };
  delivery?: { githubActions?: boolean; progressiveDelivery?: boolean; automaticRollback?: boolean; productionValidation?: boolean; rollbackOwner?: string; };
  observability?: { logs?: boolean; metrics?: boolean; traces?: boolean; datadogOwner?: string; slo?: boolean; burnRateAlerts?: boolean; customerImpactSignal?: boolean; deploymentMarkers?: boolean; };
  security?: { leastPrivilege?: boolean; workloadIdentity?: boolean; managedSecrets?: boolean; encryptionAtRest?: boolean; encryptionInTransit?: boolean; auditEvidence?: boolean; dependencyScan?: boolean; containerScan?: boolean; controlledBreakGlass?: boolean; securityOwner?: string; };
  developerExperience?: { reusableComponent?: boolean; selfService?: boolean; docs?: string; feedbackLatencyMeasured?: boolean; exceptionOwner?: string; exceptionExpiry?: string; };
  commercial?: { costOwner?: string; costPerWorkload?: boolean; budgetThreshold?: boolean; serverlessAnomalyDetection?: boolean; tradeoffDocumented?: boolean; };
};

export type GateResult = { allowed: boolean; findings: string[] };

export function evaluate(spec: PlatformSpec): GateResult {
  const i=spec.infrastructure??{}, r=spec.region??{}, d=spec.delivery??{}, o=spec.observability??{}, s=spec.security??{}, x=spec.developerExperience??{}, c=spec.commercial??{};
  const checks:Array<[boolean,string]> = [
    [Boolean(spec.owner),"platform/service owner is required"],
    [i.iacTool==="pulumi","Pulumi must be the declared IaC interface"],
    [i.pulumiPreview===true,"Pulumi preview is required"],
    [i.lambdaConcurrencyGuard===true,"Lambda concurrency guard is required"],
    [i.asyncBackpressure===true,"async queue/backpressure control is required"],
    [i.dynamodbCapacityManaged===true,"DynamoDB capacity management is required"],
    [i.auroraConnectionProtection===true,"Aurora connection protection is required"],
    [(i.capacityHeadroomPercent??0)>=30,"at least 30% capacity headroom is required"],
    [Boolean(r.recoveryRegion),"recovery region is required"],
    [(r.rtoMinutes??999999)<=60,"RTO must be 60 minutes or lower"],
    [(r.rpoMinutes??999999)<=15,"RPO must be 15 minutes or lower"],
    [r.failoverTested===true,"failover must be tested"],
    [Boolean(r.residencyClassification),"residency classification is required"],
    [r.residencySafeRouting===true,"routing must enforce residency requirements"],
    [d.githubActions===true,"GitHub Actions pipeline is required"],
    [d.progressiveDelivery===true,"progressive delivery is required"],
    [d.automaticRollback===true,"automatic rollback is required"],
    [d.productionValidation===true,"production validation is required"],
    [Boolean(d.rollbackOwner),"rollback owner is required"],
    [o.logs===true,"logs are required"],[o.metrics===true,"metrics are required"],[o.traces===true,"traces are required"],
    [Boolean(o.datadogOwner),"Datadog service owner is required"],[o.slo===true,"SLO is required"],[o.burnRateAlerts===true,"burn-rate alerts are required"],[o.customerImpactSignal===true,"customer-impact signal is required"],[o.deploymentMarkers===true,"deployment markers are required"],
    [s.leastPrivilege===true,"least privilege is required"],[s.workloadIdentity===true,"workload identity is required"],[s.managedSecrets===true,"managed secrets are required"],[s.encryptionAtRest===true,"encryption at rest is required"],[s.encryptionInTransit===true,"encryption in transit is required"],[s.auditEvidence===true,"audit evidence is required"],[s.dependencyScan===true,"dependency scanning is required"],[s.containerScan===true,"container scanning is required"],[s.controlledBreakGlass===true,"break-glass access must be controlled"],[Boolean(s.securityOwner),"security owner is required"],
    [x.reusableComponent===true,"reusable platform component is required"],[x.selfService===true,"self-service workflow is required"],[Boolean(x.docs),"developer documentation is required"],[x.feedbackLatencyMeasured===true,"developer feedback latency must be measured"],[Boolean(x.exceptionOwner),"exception owner is required"],[Boolean(x.exceptionExpiry),"exception expiry is required"],
    [Boolean(c.costOwner),"cost owner is required"],[c.costPerWorkload===true,"cost-per-workload signal is required"],[c.budgetThreshold===true,"budget/forecast threshold is required"],[c.serverlessAnomalyDetection===true,"serverless cost anomaly detection is required"],[c.tradeoffDocumented===true,"architecture/commercial trade-off must be documented"]
  ];
  const findings=checks.filter(([ok])=>!ok).map(([,m])=>m);
  return {allowed: findings.length===0, findings};
}
