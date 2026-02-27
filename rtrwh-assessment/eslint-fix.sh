# Fix unused imports in aquifer.ts
sed -i 's/import type {$/import type {/' src/lib/services/aquifer.ts

# Remove unused imports
sed -i "s/  AquiferZone,//" src/lib/services/aquifer.ts
sed -i "s/  AquiferZone//" src/lib/services/aquifer.ts

# Fix the unused imports by commenting them out
sed -i 's/import { AQUIFER_DATA, GROUNDWATER_DATA, SOIL_DATA, RECHARGE_ZONES }/import { GROUNDWATER_DATA }/' src/lib/services/aquifer.ts

# Fix location service
sed -i 's/import type {$/import type {/' src/lib/services/location.ts

