import os
import sys
from enum import Enum

def checkEnvironment():
    if "RUN" in os.environ:
        if os.environ["RUN"] == "Debug":
            print("Application is running in Debug mode")
            running_mode="Debug"
            return RunMode.DEBUG
        elif os.environ["RUN"] == "Production":
            print("Application is running in Production mode")
            sys.tracebacklimit = 0
            running_mode="Production"
            return RunMode.PRODUCTION
        else:
            raise ValueError("Environment variable RUN was not set propperly")
    else:
        print("ERROR: RUN variable was not found, please use RUN=Debug or RUN=Production")

class RunMode(Enum):
    DEBUG=1
    PRODUCTION=2

if __name__ == "__main__":
    checkEnvironment()