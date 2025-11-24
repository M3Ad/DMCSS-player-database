# Test Setup Instructions

## Manual Testing

Use the checklist in `tests/MANUAL_TEST_CHECKLIST.js` to manually verify all authentication flows.

### Prerequisites
1. Have at least two test accounts in Supabase:
   - One with `role = 'player'`
   - One with `role = 'coach'`

### Running Manual Tests
1. Start the dev server: `npm run dev`
2. Open `tests/MANUAL_TEST_CHECKLIST.js`
3. Follow each test case step-by-step
4. Record results in the template at the bottom

---

## Automated Testing with Playwright

### Setup

1. **Install Playwright:**
   ```bash
   npm install -D @playwright/test
   npx playwright install
   ```

2. **Create test accounts in Supabase:**
   - Email: `player@test.com`, Password: `password123`, Role: `player`
   - Email: `coach@test.com`, Password: `password123`, Role: `coach`

### Running Tests

**Run all tests:**
```bash
npx playwright test
```

**Run tests in headed mode (see browser):**
```bash
npx playwright test --headed
```

**Run tests in UI mode (interactive):**
```bash
npx playwright test --ui
```

**Run specific test file:**
```bash
npx playwright test auth.spec.js
```

**Debug a specific test:**
```bash
npx playwright test --debug
```

**View test report:**
```bash
npx playwright show-report
```

### Test Coverage

The automated tests cover:
- ✅ Login form validation (empty fields, invalid email, password length)
- ✅ Successful login and redirect
- ✅ Invalid credentials error handling
- ✅ Page protection for unauthenticated users
- ✅ Role-based access control (player vs coach)
- ✅ Logout functionality
- ✅ Session persistence across reloads
- ✅ Form error clearing on input
- ✅ Loading states during authentication

### Test Results Location

After running tests, results are saved to:
- `playwright-report/` - HTML report with screenshots
- `test-results/` - Raw test artifacts

### CI/CD Integration

To run tests in CI/CD pipeline:

```yaml
# Example GitHub Actions workflow
- name: Install dependencies
  run: npm ci

- name: Install Playwright browsers
  run: npx playwright install --with-deps

- name: Run Playwright tests
  run: npx playwright test

- name: Upload test results
  uses: actions/upload-artifact@v3
  if: always()
  with:
    name: playwright-report
    path: playwright-report/
```

### Customization

Edit `playwright.config.js` to:
- Change base URL
- Add/remove browsers to test
- Adjust timeout settings
- Configure CI behavior
- Modify reporter settings

### Troubleshooting

**Tests failing locally?**
1. Ensure dev server is running on port 3000
2. Verify test accounts exist in Supabase
3. Check that environment variables are set in `.env.local`
4. Clear browser cache/cookies if needed

**Timeout errors?**
- Increase timeout in `playwright.config.js`
- Check network connectivity
- Verify Supabase is accessible

**Screenshots show errors?**
- Look in `test-results/` folder
- View HTML report with `npx playwright show-report`
