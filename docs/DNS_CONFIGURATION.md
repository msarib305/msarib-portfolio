# DNS Configuration

Single source of truth for the DNS state of msarib.dev. Update this file whenever a DNS record changes. Every section includes the current record value and the reason it exists.

Last verified: 2026-06-06

---

## Overview

| Property | Value |
|----------|-------|
| Domain | msarib.dev |
| Registrar | Namecheap |
| DNS provider | Cloudflare (nameservers delegated from Namecheap) |
| Cloudflare proxy policy | OFF (grey cloud, DNS-only) on all records pointing at Vercel. Orange cloud breaks Vercel SSL provisioning and causes redirect loops. See DEC-004. |
| Canonical URL | https://msarib.dev (apex). www.msarib.dev redirects 308 to apex. |
| SSL | Let's Encrypt, auto-provisioned by Vercel, CN=msarib.dev, expires 2026-08-02. Auto-renews. |

---

## DNS Records

### Nameservers

| Type | Name | Value | TTL |
|------|------|-------|-----|
| NS | msarib.dev | amos.ns.cloudflare.com | 24 hrs |
| NS | msarib.dev | shubhi.ns.cloudflare.com | 24 hrs |

Cloudflare's assigned nameservers. Set at Namecheap under Domain List → msarib.dev → Nameservers → Custom DNS.

### Vercel (site hosting)

| Type | Name | Value | Proxy | TTL |
|------|------|-------|-------|-----|
| CNAME | msarib.dev | 3104b934ae16a7ff.vercel-dns-017.com | DNS-only (grey) | 5 min |
| CNAME | www.msarib.dev | 3104b934ae16a7ff.vercel-dns-017.com | DNS-only (grey) | 5 min |

Newer Vercel CNAME routing pattern (replaces the older A record `76.76.21.21` approach). Both records must remain grey-cloud. See DEC-004.

### Email routing (inbound)

| Type | Name | Value | Priority | TTL |
|------|------|-------|----------|-----|
| MX | msarib.dev | route1.mx.cloudflare.net | 54 | 5 min |
| MX | msarib.dev | route2.mx.cloudflare.net | 94 | 5 min |
| MX | msarib.dev | route3.mx.cloudflare.net | 99 | 5 min |

Auto-added by Cloudflare Email Routing. Routes inbound mail to Gmail forwarding rules.

### Ownership verification

| Type | Name | Value | TTL |
|------|------|-------|-----|
| TXT | msarib.dev | `google-site-verification=[token]` | 5 min |

Google Search Console Domain Property verification. Added 2026-06-06. Token value is not sensitive (publicly visible in DNS). To find the exact token: Cloudflare dashboard → msarib.dev → DNS → Records, look for the TXT record at `@` containing `google-site-verification=`.

### Email authentication (SPF)

| Type | Name | Value | TTL |
|------|------|-------|-----|
| TXT | msarib.dev | `v=spf1 include:_spf.mx.cloudflare.net ~all` | 5 min |
| TXT | send.msarib.dev | `v=spf1 include:amazonses.com ~all` | 5 min |

Two separate SPF records on different hostnames — no conflict (RFC 7208 per-hostname rule).

- Root domain SPF (`msarib.dev`): auto-added by Cloudflare Email Routing. Authorizes Cloudflare's infrastructure for inbound forwarding relay.
- Subdomain SPF (`send.msarib.dev`): added by Resend during domain verification. Authorizes Amazon SES for Resend outbound sending. Resend sets `MAIL FROM: @send.msarib.dev` as the Return-Path, so the SPF check resolves against `send.msarib.dev`, not the root. Resend can send from `hello@msarib.dev` without a root-level SPF entry because DMARC alignment uses DKIM, not SPF, as the primary mechanism.

### Email authentication (DKIM)

| Type | Name | Value | TTL |
|------|------|-------|-----|
| CNAME | resend._domainkey.msarib.dev | resend._domainkey.msarib.dev (→ public key via CNAME chain) | 5 min |

Added by Resend during domain verification. Selector: `resend`. DKIM signing covers all outbound mail sent via Resend from `hello@msarib.dev` or `contact@msarib.dev`. Domain verified in Resend dashboard (eu-west-1 region).

### Email authentication (DMARC)

| Type | Name | Value | TTL |
|------|------|-------|-----|
| TXT | _dmarc.msarib.dev | `v=DMARC1; p=none; rua=mailto:contact@msarib.dev; aspf=r; adkim=r` | 5 min |

- `p=none`: monitor-only. No mail is rejected or quarantined at this policy level.
- `rua=mailto:contact@msarib.dev`: aggregate reports forwarded to Gmail via Cloudflare Email Routing.
- `aspf=r`: relaxed SPF alignment. Allows `send.msarib.dev` subdomain to align with `msarib.dev` for SPF.
- `adkim=r`: relaxed DKIM alignment.

Upgrade path: after reviewing aggregate reports for one to two weeks with no legitimate sources failing, update to `p=quarantine`, then `p=reject`. Edit the TXT record value in Cloudflare DNS. See DEC-069.

---

## DNSSEC

| Property | Value |
|----------|-------|
| Status | Enabled |
| Key Tag | 2371 |
| Algorithm | 13 (ECDSA Curve P-256 with SHA-256) |
| Digest Type | 2 (SHA-256) |
| Digest | 358DB47F93E0133915FF56637276C52E8A2C1FDDEB80B1255260E1AD9EE12D40 |
| DS record location | Submitted to Namecheap → Domain List → msarib.dev → Advanced DNS → DNSSEC |
| Chain status | Full chain verified: root → .dev TLD (DS=60074) → msarib.dev (DS=2371) |

Cloudflare signs all DNS responses for msarib.dev. The DS record at Namecheap anchors the trust chain to the .dev TLD registry (Google Registry). Verified via Verisign DNSSEC Debugger on 2026-06-06.

**If DNSSEC breaks the domain** (SERVFAIL on all resolvers):
1. Log into Namecheap → Advanced DNS → DNSSEC → delete the DS record entry.
2. Log into Cloudflare → DNS → Settings → DNSSEC → Disable DNSSEC.
3. Wait up to 24 hours for propagation (usually under 2 hours).
4. Do not re-enable without understanding the cause.

---

## CAA Records

| Type | Name | Flag | Tag | Value | Source |
|------|------|------|-----|-------|--------|
| CAA | msarib.dev | 0 | issue | `letsencrypt.org` | Manual |
| CAA | msarib.dev | 0 | issuewild | `;` | Manual |
| CAA | msarib.dev | 0 | iodef | `mailto:contact@msarib.dev` | Manual |
| CAA | msarib.dev | 0 | issue | `digicert.com; cansignhttpexchanges=yes` | Cloudflare auto |
| CAA | msarib.dev | 0 | issue | `pki.goog; cansignhttpexchanges=yes` | Cloudflare auto |
| CAA | msarib.dev | 0 | issue | `ssl.com` | Cloudflare auto |
| CAA | msarib.dev | 0 | issue | `comodoca.com` | Cloudflare auto |
| CAA | msarib.dev | 0 | issuewild | `letsencrypt.org` | Cloudflare auto |
| CAA | msarib.dev | 0 | issuewild | `digicert.com; cansignhttpexchanges=yes` | Cloudflare auto |
| CAA | msarib.dev | 0 | issuewild | `pki.goog; cansignhttpexchanges=yes` | Cloudflare auto |
| CAA | msarib.dev | 0 | issuewild | `ssl.com` | Cloudflare auto |
| CAA | msarib.dev | 0 | issuewild | `comodoca.com` | Cloudflare auto |

3 manual records added in Phase 17. Cloudflare auto-injects additional CAA entries on the free plan (not user-toggleable without the Advanced Certificate Manager paid add-on at ~$10/month).

Effective posture: 6 Tier-1 CAs authorized (Let's Encrypt, DigiCert, Google Trust Services, SSL.com, Comodo). The `iodef` record routes unauthorized issuance notifications to `contact@msarib.dev`. The manual `issuewild ";"` entry is superseded by Cloudflare's auto-injected wildcard entries.

Future consideration: Cloudflare ACM (~$10/month) disables auto-injection and allows restricting issuance to Let's Encrypt only. See AGENTS.md Future Work.

---

## Vercel Domain Configuration

| Domain | Role | Status | SSL |
|--------|------|--------|-----|
| msarib.dev | Production (main branch) | Valid Configuration | Active, Let's Encrypt |
| www.msarib.dev | Redirect 308 → msarib.dev | Valid Configuration | Active, Let's Encrypt |

SSL cert: `CN=msarib.dev`, issued by Let's Encrypt (R13), expires 2026-08-02. Vercel auto-renews 14 to 30 days before expiry.

---

## Email Routing Configuration

### Inbound routing rules (Cloudflare Email Routing)

| From | Action | To |
|------|--------|----|
| hello@msarib.dev | Forward | msarib.contact@gmail.com |
| contact@msarib.dev | Forward | msarib.contact@gmail.com |
| Catch-all @msarib.dev | Forward | msarib.contact@gmail.com |

### Outbound (Resend)

Resend sends FROM `hello@msarib.dev` via Amazon SES (eu-west-1). MAIL FROM is `send.msarib.dev`. SPF check passes against `send.msarib.dev`. DKIM signature from `resend._domainkey.msarib.dev` provides DMARC alignment.

### Recipient-side configuration

Gmail filter on `msarib.contact@gmail.com` whitelists all mail forwarded to `*@msarib.dev` to bypass Gmail's spam filter. Required because Cloudflare-forwarded mail triggers Gmail's heuristic spam flags on new domains until domain reputation is established. Filter created manually in Gmail settings during Phase 17 setup.

---

## Verification Commands

Install dnsutils if not present: `sudo apt install -y dnsutils`

```bash
# Nameservers
dig +short NS msarib.dev
# expect: amos.ns.cloudflare.com, shubhi.ns.cloudflare.com

# A / CNAME records
dig +short A msarib.dev
dig +short CNAME www.msarib.dev

# MX records (Cloudflare Email Routing)
dig +short MX msarib.dev
# expect: 3 route*.mx.cloudflare.net entries

# SPF (root — Cloudflare Email Routing)
dig +short TXT msarib.dev | grep "v=spf1"
# expect: exactly ONE record: v=spf1 include:_spf.mx.cloudflare.net ~all

# SPF (Resend subdomain)
dig +short TXT send.msarib.dev | grep "v=spf1"
# expect: v=spf1 include:amazonses.com ~all

# DKIM (Resend)
dig +short CNAME resend._domainkey.msarib.dev
# expect: CNAME resolving to Resend's public key infrastructure

# DMARC
dig +short TXT _dmarc.msarib.dev
# expect: "v=DMARC1; p=none; rua=mailto:contact@msarib.dev; aspf=r; adkim=r"

# DNSSEC DS record
dig +short DS msarib.dev
# expect: 2371 13 2 358DB47F93E0133915FF56637276C52E8A2C1FDDEB80B1255260E1AD9EE12D40

# DNSSEC chain validation
dig +dnssec +short msarib.dev A
# expect: A record(s) plus RRSIG record(s)

# CAA records
dig +short CAA msarib.dev
# expect: 12 records (3 manual + Cloudflare auto-injected)

# SSL cert
curl -Iv https://msarib.dev 2>&1 | grep -E "subject:|issuer:|expire date:"
# expect: CN=msarib.dev, Let's Encrypt, expiry Aug 2026

# Canonical redirect
curl -Is https://msarib.dev       # expect HTTP 200
curl -Is https://www.msarib.dev   # expect HTTP 308 → msarib.dev
```

Online alternatives (no dnsutils required):
- Full DNS check: https://mxtoolbox.com/SuperTool.aspx?action=dns%3amsarib.dev
- MX check: https://mxtoolbox.com/SuperTool.aspx?action=mx%3amsarib.dev
- SPF check: https://mxtoolbox.com/SuperTool.aspx?action=spf%3amsarib.dev
- DMARC check: https://mxtoolbox.com/SuperTool.aspx?action=dmarc%3amsarib.dev
- DNSSEC chain: https://dnssec-analyzer.verisignlabs.com/msarib.dev

---

## Change Procedure

Before making any DNS change:

1. Run the verification commands above and record the current state in a scratch file.
2. Export the Cloudflare zone as a BIND file: Cloudflare dashboard → DNS → Records → Export. Save to `~/dns-backups/` outside the git repo.

Making the change:
3. Make one change at a time. Never batch multiple DNS changes.
4. For DNSSEC changes: disable at Cloudflare AND remove DS record at Namecheap before modifying. Half-states cause SERVFAIL.
5. For SPF: ensure exactly one SPF TXT record exists per hostname after the change.

After the change:
6. Wait for propagation. TTL on most records is 5 minutes; NS changes and DS records can take up to 24 hours.
7. Re-run the relevant verification commands to confirm the new state.
8. Update this file with the new values and the change date.
9. Commit: `docs/DNS_CONFIGURATION.md` only, with message `chore(dns): update DNS_CONFIGURATION.md - [brief description]`.
