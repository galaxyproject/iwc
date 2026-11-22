import sys
from pathlib import Path

# The scripts aren't a package; they import each other by bare module name
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
