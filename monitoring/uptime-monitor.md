# Uptime Monitoring Setup

This guide shows how to set up uptime monitoring for your MERN Todo application.

## Why Uptime Monitoring?

Uptime monitoring helps you:
- Detect when your application goes down
- Get instant alerts via email/SMS
- Track uptime percentage over time
- Monitor response times
- Receive status page for users

## Recommended Services

### 1. UptimeRobot (Recommended - Free)

**Features:**
- Free tier: 50 monitors, 5-minute intervals
- Email/SMS/Webhook alerts
- Public status pages
- SSL certificate monitoring

**Setup Steps:**

1. **Sign up at [UptimeRobot](https://uptimerobot.com)**

2. **Create Monitor for Backend:**
   ```
   Monitor Type: HTTP(s)
   Friendly Name: MERN Todo API
   URL: https://your-backend-url.onrender.com/api/health
   Monitoring Interval: 5 minutes
   ```

3. **Create Monitor for Frontend:**
   ```
   Monitor Type: HTTP(s)
   Friendly Name: MERN Todo Frontend
   URL: https://your-frontend-url.vercel.app
   Monitoring Interval: 5 minutes
   ```

4. **Set up Alerts:**
   - Add your email
   - Configure alert contacts
   - Set alert preferences (when down, when up)

5. **Create Status Page (Optional):**
   - Go to "Status Pages"
   - Create public status page
   - Add both monitors
   - Customize appearance

### 2. Better Uptime

**Features:**
- More frequent checks (30 seconds on paid plan)
- Incident management
- On-call scheduling
- Status pages

**Setup:**
1. Sign up at [Better Uptime](https://betteruptime.com)
2. Add monitors similar to UptimeRobot
3. Configure on-call rotations

### 3. Pingdom

**Features:**
- Detailed performance monitoring
- Real user monitoring
- Transaction monitoring

**Setup:**
1. Sign up at [Pingdom](https://www.pingdom.com)
2. Add uptime checks
3. Set up alerts

## Monitor Configuration

### Health Check Endpoints

Your application provides multiple health endpoints:

```
# Basic health check
GET /api/health
Expected: 200 OK

# Detailed health with DB status
GET /api/health/detailed
Expected: 200 OK (if DB connected)

# Kubernetes-style probes
GET /api/health/ready  # Readiness
GET /api/health/live   # Liveness
```

### Recommended Monitoring Setup

Monitor these endpoints:

1. **Primary Monitor:**
   - URL: `/api/health`
   - Interval: 5 minutes
   - Alert on: Down, SSL expiry

2. **Database Health:**
   - URL: `/api/health/detailed`
   - Interval: 10 minutes
   - Alert on: Down, degraded status

3. **Frontend Monitor:**
   - URL: `https://your-frontend-url.vercel.app`
   - Interval: 5 minutes
   - Check for specific text in response

## Alert Configuration

### Email Alerts

Configure alerts for:
- Monitor down
- Monitor up (recovery)
- SSL certificate expiry (< 30 days)

### Webhook Integration

For advanced workflows, use webhooks:

```json
{
  "monitor_name": "MERN Todo API",
  "status": "down",
  "reason": "Timeout",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

Send webhooks to:
- Slack
- Discord
- Custom API endpoint

### Slack Integration Example

1. Create Slack webhook URL
2. Add to UptimeRobot:
   ```
   Alert Contact Type: Webhook
   URL: https://hooks.slack.com/services/YOUR/WEBHOOK/URL
   POST Value:
   {
     "text": "*monitorFriendlyName* is *statusFriendlyName*"
   }
   ```

## Status Page Setup

Create a public status page for users:

1. **UptimeRobot Status Page:**
   - Go to Status Pages → Add New
   - Select monitors to display
   - Customize design
   - Get public URL

2. **Custom Domain (Optional):**
   - Use custom domain: status.yourdomain.com
   - Add CNAME record to your DNS

Example Status Page Content:
```
✅ Frontend Application - Operational
✅ Backend API - Operational
✅ Database - Operational

Last 90 days uptime: 99.9%
```

## Monitoring Best Practices

### 1. Monitor Critical Paths

Monitor these critical paths:
- User authentication
- Todo CRUD operations
- Database connectivity

### 2. Set Appropriate Intervals

```
Critical services: 1-2 minutes
Standard services: 5 minutes
Non-critical: 15 minutes
```

### 3. Configure Escalation

```
1. Down for 2 minutes → Email
2. Down for 5 minutes → SMS
3. Down for 15 minutes → Phone call
```

### 4. Use Multiple Locations

Monitor from different geographic locations:
- US East
- US West
- Europe
- Asia

### 5. Track Metrics

Monitor and track:
- Response time (target: < 500ms)
- Uptime percentage (target: 99.9%)
- SSL certificate expiry
- Error rates

## Response Time Monitoring

Track performance over time:

```
Excellent: < 200ms
Good: 200-500ms
Fair: 500-1000ms
Poor: > 1000ms
```

Set alerts for:
- Response time > 1000ms for 5 minutes
- Response time > 2000ms immediate

## Integration with CI/CD

Add uptime checks to your deployment pipeline:

```yaml
# .github/workflows/deploy.yml
- name: Wait for deployment
  run: sleep 60

- name: Check health
  run: |
    curl -f https://your-api.onrender.com/api/health || exit 1
```

## Monitoring Dashboard

Create a dashboard to view all metrics:

1. **Render Dashboard:**
   - CPU usage
   - Memory usage
   - Request count
   - Response times

2. **Vercel Analytics:**
   - Page views
   - Performance scores
   - Core Web Vitals

3. **MongoDB Atlas:**
   - Connection count
   - Operations/sec
   - Storage used

4. **UptimeRobot:**
   - Uptime percentage
   - Response times
   - Incident history

## Incident Response Plan

When monitors alert:

1. **Immediate (0-5 minutes):**
   - Check status dashboards
   - Verify it's not a false alarm
   - Check recent deployments

2. **Investigation (5-15 minutes):**
   - Check application logs
   - Check error tracking (Sentry)
   - Identify root cause

3. **Resolution (15-30 minutes):**
   - Apply fix or rollback
   - Monitor recovery
   - Update status page

4. **Post-Incident:**
   - Document incident
   - Identify prevention measures
   - Update monitoring if needed

## Cost Comparison

| Service | Free Tier | Paid Plans |
|---------|-----------|------------|
| UptimeRobot | 50 monitors, 5 min | $7/mo for 10 monitors, 1 min |
| Better Uptime | 10 monitors | $18/mo for more features |
| Pingdom | Trial only | $10/mo starter |

**Recommendation:** Start with UptimeRobot free tier, upgrade as needed.

## Checklist

- [ ] Sign up for monitoring service
- [ ] Add backend health monitor
- [ ] Add frontend monitor
- [ ] Configure email alerts
- [ ] Set up status page
- [ ] Test alerts (pause monitor)
- [ ] Add webhook integrations
- [ ] Document in README
- [ ] Share status page URL with users

## Additional Resources

- [UptimeRobot Documentation](https://uptimerobot.com/help)
- [Better Uptime Guides](https://docs.betteruptime.com/)
- [Monitoring Best Practices](https://uptimerobot.com/blog/)

---

**Last Updated:** [Current Date]