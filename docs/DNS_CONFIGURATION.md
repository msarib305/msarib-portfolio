# DNS Configuration

Single source of truth for the DNS state of msarib.dev. Update this file whenever a DNS record changes. Every section includes the current record value and the reason it exists.

Last verified: 2026-06-30

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

### Email (inbound MX, Zoho Mail)

| Type | Name | Value | Priority | TTL |
|------|------|-------|----------|-----|
| MX | msarib.dev | mx.zoho.com | 10 | 5 min |
| MX | msarib.dev | mx2.zoho.com | 20 | 5 min |
| MX | msarib.dev | mx3.zoho.com | 50 | 5 min |

Inbound mail is delivered to Zoho Mail (Forever Free) mailboxes. Priorities are
the Zoho standard (10 / 20 / 50); verify the exact values against the live
Cloudflare zone. Cloudflare Email Routing is disabled; the old
route{1,2,3}.mx.cloudflare.net entries were removed during the Zoho migration.

### Ownership verification

| Type | Name | Value | TTL |
|------|------|-------|-----|
| TXT | msarib.dev | `google-site-verification=[token]` | 5 min |

Google Search Console Domain Property verification. Added 2026-06-06. Token value is not sensitive (publicly visible in DNS). To find the exact token: Cloudflare dashboard → msarib.dev → DNS → Records, look for the TXT record at `@` containing `google-site-verification=`.

### Email authentication (SPF)

| Type | Name | Value | TTL |
|------|------|-------|-----|
| TXT | msarib.dev | `v=spf1 include:zohomail.com ~all` | 5 min |
| TXT | send.msarib.dev | `v=spf1 include:amazonses.com ~all` | 5 min |

Two separate SPF records on different hostnames — no conflict (RFC 7208 per-hostname rule).

- Root domain SPF (`msarib.dev`): authorizes Zoho's infrastructure to send mail as `@msarib.dev` (Sarib's personal Zoho mailbox). Replaced the Cloudflare Email Routing include (`_spf.mx.cloudflare.net`) during the Zoho migration.
- Subdomain SPF (`send.msarib.dev`): added by Resend during domain verification. Authorizes Amazon SES for Resend outbound sending. Resend sets `MAIL FROM: @send.msarib.dev` as the Return-Path, so the SPF check resolves against `send.msarib.dev`, not the root. Resend can send from `hello@msarib.dev` without a root-level SPF entry because DMARC alignment uses DKIM, not SPF, as the primary mechanism.

### Email authentication (DKIM)

| Type | Name | Value | TTL |
|------|------|-------|-----|
| TXT | zmail._domainkey.msarib.dev | `v=DKIM1; k=rsa; p=<Zoho public key>` | 5 min |
| CNAME | resend._domainkey.msarib.dev | resend._domainkey.msarib.dev (→ public key via CNAME chain) | 5 min |

Two selectors, one per sender:

- `zmail` (Zoho): a TXT record holding the RSA public key. Signs outbound mail from Sarib's personal Zoho mailbox (`contact@msarib.dev`). The full key value lives in the Cloudflare zone (Zoho dashboard → Email Configuration → DKIM); it is not reproduced here.
- `resend` (Resend): a CNAME chain to Resend's key. Signs the transactional contact-form mail sent from `hello@msarib.dev` via Amazon SES. Domain verified in the Resend dashboard (eu-west-1 region).

### Email authentication (DMARC)

| Type | Name | Value | TTL |
|------|------|-------|-----|
| TXT | _dmarc.msarib.dev | `v=DMARC1; p=quarantine; rua=mailto:contact@msarib.dev; aspf=r; adkim=r` | 5 min |

- `p=quarantine`: mail failing DMARC is quarantined (spam folder) by the receiver. Raised from `p=none` during the Zoho migration once both senders (Zoho, Resend) were confirmed aligned.
- `rua=mailto:contact@msarib.dev`: aggregate reports land directly in the Zoho mailbox (no longer forwarded via Cloudflare Email Routing).
- `aspf=r`: relaxed SPF alignment. Allows the `send.msarib.dev` subdomain to align with `msarib.dev` for Resend's SPF.
- `adkim=r`: relaxed DKIM alignment. Both the `zmail` (Zoho) and `resend` (Resend) selectors sign under `msarib.dev`.

Upgrade path: after a clean period at `p=quarantine` with no legitimate sources failing, update to `p=reject`. Edit the TXT record value in Cloudflare DNS. See DEC-069 and DEC-090.

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

## Email Configuration

### Inbound (Zoho Mail)

Inbound mail to `@msarib.dev` is delivered to Zoho Mail (Forever Free) via the MX
records above. `contact@msarib.dev` is a real Zoho mailbox, not a forwarding
alias. Cloudflare Email Routing is disabled; its forwarding rules (`hello@`,
`contact@`, and catch-all `@msarib.dev` to `msarib.contact@gmail.com`) and the
auto-added route*.mx.cloudflare.net MX records were removed during the migration.
The Gmail spam-bypass filter from the old forwarding setup is no longer
load-bearing.

### Outbound (two senders)

- **Zoho** (personal mail): Sarib sends from `contact@msarib.dev`. SPF authorized
  via the root `include:zohomail.com`; DKIM signed with the `zmail` selector.
- **Resend** (transactional contact form): sends FROM `hello@msarib.dev` via
  Amazon SES (eu-west-1). MAIL FROM is `send.msarib.dev`, so SPF passes against
  the subdomain; the `resend` DKIM selector provides DMARC alignment. The
  contact-form Server Action delivers to `RESEND_TO_EMAIL`, the Zoho
  `contact@msarib.dev` mailbox.

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

# MX records (Zoho Mail)
dig +short MX msarib.dev
# expect: 10 mx.zoho.com, 20 mx2.zoho.com, 50 mx3.zoho.com

# SPF (root — Zoho)
dig +short TXT msarib.dev | grep "v=spf1"
# expect: exactly ONE record: v=spf1 include:zohomail.com ~all

# SPF (Resend subdomain)
dig +short TXT send.msarib.dev | grep "v=spf1"
# expect: v=spf1 include:amazonses.com ~all

# DKIM (Zoho)
dig +short TXT zmail._domainkey.msarib.dev
# expect: v=DKIM1; k=rsa; p=... (Zoho public key)

# DKIM (Resend)
dig +short CNAME resend._domainkey.msarib.dev
# expect: CNAME resolving to Resend's public key infrastructure

# DMARC
dig +short TXT _dmarc.msarib.dev
# expect: "v=DMARC1; p=quarantine; rua=mailto:contact@msarib.dev; aspf=r; adkim=r"

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
