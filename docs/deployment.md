# Firebase Functions Deployment — IAM Checklist

This documents the required Google Cloud setup to deploy Firebase Cloud Functions for the Agora Captain app. Assembled after 8 failed deployments while adding the `chatWithAgora` function in April 2026.

---

## Service Account

**Account:** `firebase-adminsdk-fbsvc@agora-captain.iam.gserviceaccount.com`

The JSON key for this account is stored as the GitHub Actions secret `FIREBASE_SERVICE_ACCOUNT`.

**NEVER commit the service account key to the repository.**

---

## Required IAM Roles

All four roles are required. Assign in **Google Cloud Console → IAM & Admin → IAM**.

| Role | Why needed |
|---|---|
| **Editor** | Basic project access and resource management |
| **Cloud Functions Admin** | Deploy, update, and set IAM policy on functions |
| **Artifact Registry Administrator** | Push container images (Functions v2 uses Cloud Run) |
| **Cloud Build Editor** | Trigger build jobs during function deployment |

### How to Add Roles

1. Go to [console.cloud.google.com](https://console.cloud.google.com) → IAM & Admin → IAM
2. Find `firebase-adminsdk-fbsvc@agora-captain.iam.gserviceaccount.com`
3. Click the pencil (Edit) icon
4. Click **Add Another Role** for each role above
5. Save

---

## Required APIs

Enable all of these. Most are auto-enabled, but Cloud Billing must be enabled manually.

| API | Why needed |
|---|---|
| Cloud Functions API | Core deployment |
| Cloud Build API | Builds function containers |
| Artifact Registry API | Stores container images |
| Cloud Run API | Functions v2 runs on Cloud Run |
| **Cloud Billing API** | Required for Functions v2 to deploy — commonly missed |

### How to Enable APIs

Go to: `console.developers.google.com/apis/api/<api-name>/overview`

Or: Cloud Console → APIs & Services → Enable APIs & Services → search by name.

For Cloud Billing specifically:
`console.developers.google.com/apis/api/cloudbilling.googleapis.com`

---

## GitHub Actions Workflow

File: `.github/workflows/deploy-functions.yml`

**Triggers:** Push to `main` with changes under `functions/` — OR manual dispatch.

```yaml
name: Deploy Firebase Functions
on:
  push:
    branches: [main]
    paths: ["functions/**"]
  workflow_dispatch:
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "22"
      - name: Install root dependencies
        run: npm install --legacy-peer-deps
      - name: Install function dependencies
        run: cd functions && npm install
      - name: Deploy functions
        env:
          GOOGLE_APPLICATION_CREDENTIALS: /tmp/sa.json
          FIREBASE_SERVICE_ACCOUNT: ${{ secrets.FIREBASE_SERVICE_ACCOUNT }}
        run: |
          echo "$FIREBASE_SERVICE_ACCOUNT" > /tmp/sa.json
          npx firebase deploy --only functions --project agora-captain
```

---

## Secrets

| Secret | Where stored | Purpose |
|---|---|---|
| `FIREBASE_SERVICE_ACCOUNT` | GitHub repo → Settings → Secrets and variables → Actions | Service account JSON key for deployment |
| `ANTHROPIC_API_KEY` | Firebase Secret Manager | API key for Claude (Haiku) used by chatWithAgora function |

---

## Troubleshooting Common Failures

| Error message | Fix |
|---|---|
| `Cloud Billing API has not been used in project` | Enable Cloud Billing API at console.developers.google.com |
| `cloudfunctions.functions.setIamPolicy permission` | Add **Cloud Functions Admin** role to service account |
| `Permission denied on Artifact Registry` | Add **Artifact Registry Administrator** role |
| `Cloud Build permission denied` | Add **Cloud Build Editor** role |
| `Secret not found` | Verify `FIREBASE_SERVICE_ACCOUNT` secret exists in GitHub repo Settings |
| `ANTHROPIC_API_KEY not found` | Add API key to Firebase Secret Manager (console.firebase.google.com → Project Settings → Secret Manager) |

---

## Functions Deployed

| Function name | Trigger | Purpose |
|---|---|---|
| `chatWithAgora` | HTTPS POST | AI chat assistant — Claude Haiku with Agora system prompt |
| `scanFuelReceipt` | HTTPS POST | Receipt photo → parsed fuel log fields (also uses Claude Haiku) |

Both functions allow CORS only from `https://barrett928-design.github.io`.

---

## Notes

- Functions use Firebase Functions v2 (`firebase-functions/v2/https`) which runs on Cloud Run
- Node.js 22 runtime
- `ANTHROPIC_API_KEY` is a Firebase Secret (accessed via `defineSecret`) — NOT an environment variable
- After any IAM change, wait 1–2 minutes before re-running the deployment
