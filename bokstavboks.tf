terraform {
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4"
    }
  }
}

variable "cloudflare_api_token" {
  default = ""
}

locals {
  zones = {
    "bokstavboks.no"  = "58a5b04492c16abfbcb89f131853dd80"
  }
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}

resource "cloudflare_record" "a_records" {
  for_each = {
    for val in setproduct(
      toset(["bokstavboks.no"]),
      [
        "185.199.111.153",
        "185.199.110.153",
        "185.199.109.153",
        "185.199.108.153"
      ]
      ) : "${val[0]}-${val[1]}" => {
      domain = val[0]
      ip     = val[1]
    }
  }
  zone_id = local.zones[each.value.domain]
  content = each.value.ip
  name    = each.value.domain
  proxied = true
  ttl     = 1
  type    = "A"
}

resource "cloudflare_record" "aaaa_records" {
  for_each = {
    for val in setproduct(
      toset(["bokstavboks.no"]),
      [
        "2606:50c0:8003::153",
        "2606:50c0:8002::153",
        "2606:50c0:8001::153",
        "2606:50c0:8000::153"
      ]
      ) : "${val[0]}-${val[1]}" => {
      domain = val[0]
      ip     = val[1]
    }
  }
  zone_id = local.zones[each.value.domain]
  content = each.value.ip
  name    = each.value.domain
  proxied = true
  ttl     = 1
  type    = "AAAA"
}

resource "cloudflare_record" "txt_records_no" {
  for_each = {
    # Tell recipients that this domain will never send email
    "_dmarc"        = "v=DMARC1; p=reject; sp=reject; adkim=s; aspf=s;",
    "*._domainkey"  = "v=DKIM1; p=",
    "bokstavboks.no" = "v=spf1 -all",
  }
  zone_id = local.zones["bokstavboks.no"]
  name    = each.key
  content = each.value
  proxied = false
  ttl     = 1
  type    = "TXT"
}

resource "cloudflare_record" "cname_no" {
  for_each = {
    "www" = "bokstavboks.no"
  }
  zone_id  = local.zones["bokstavboks.no"]
  name     = each.key
  content  = each.value
  proxied  = true
  ttl      = 1
  type     = "CNAME"
}
