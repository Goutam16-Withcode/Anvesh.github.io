"""
ANVESH Continuous Ingestion Scheduler
Runs periodic automated ingestion tasks across external job boards at configured intervals.
Supports daemon execution mode for containerized environments.
"""

import os
import time
import argparse
from datetime import datetime
from ingestion.pipelines.orchestrator import IngestionOrchestrator


def run_continuous_scheduler(interval_hours: float = 6.0, limit_per_source: int = 50):
    """
    Continuous loop that triggers job ingestion from multiple sources every `interval_hours`.
    """
    orchestrator = IngestionOrchestrator()
    interval_seconds = int(interval_hours * 3600)
    sources = ["sample", "remoteok", "arbeitnow"]

    print("=============================================================")
    print(f"⏰ [ANVESH Scheduler] Background Ingestion Daemon Started")
    print(f"⏰ Cadence: Every {interval_hours} hours ({interval_seconds}s)")
    print(f"⏰ Sources: {', '.join(sources)}")
    print("=============================================================")

    iteration = 1
    while True:
        cycle_start = datetime.utcnow()
        print(f"\n🔄 [Cycle #{iteration}] Triggered at {cycle_start.isoformat()}Z")

        for src in sources:
            try:
                orchestrator.run_pipeline(source_name=src, limit=limit_per_source, dry_run=False)
            except Exception as e:
                print(f"❌ Error during scheduled run for '{src}': {e}")

        cycle_end = datetime.utcnow()
        duration = (cycle_end - cycle_start).total_seconds()
        print(f"✅ [Cycle #{iteration}] Finished in {duration:.2f}s. Next run in {interval_hours}h.")

        iteration += 1
        time.sleep(interval_seconds)


def main():
    parser = argparse.ArgumentParser(description="ANVESH Background Ingestion Scheduler")
    parser.add_argument("--interval-hours", type=float, default=6.0, help="Cadence interval in hours")
    parser.add_argument("--limit", type=int, default=25, help="Limit per source")
    args = parser.parse_args()

    run_continuous_scheduler(interval_hours=args.interval_hours, limit_per_source=args.limit)


if __name__ == "__main__":
    main()
