# TODO for Backend Institute Registration Validation

## Overview
Update Registering.controller.js to validate instituteCode against check_verfied_institution.csv if instituteType is 'university'.
- Install csv-parser if needed.
- Read CSV file and check if instituteCode exists.
- If not university or code exists, proceed; else, throw error.

## Steps
- [x] Step 1: Install csv-parser dependency.
- [x] Step 2: Import fs and csv-parser in controller.
- [x] Step 3: In registerInstitute, if instituteType === 'university', read CSV and validate instituteCode.
- [x] Step 4: If code not found, throw error 'Invalid institute code for university'.
- [x] Step 5: Test the registration endpoint.

## Dependencies
- csv-parser for CSV reading.

## Follow-up
- Verify validation works for university type.
- Update TODO.md as steps complete.
