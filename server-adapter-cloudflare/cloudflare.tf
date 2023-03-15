terraform {
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "3.31.0"
    }
  }
}

provider "cloudflare" {
  api_token = "TQA03Sq7lU3kHAGIZ-huB_m_tbnldmHHcYO_jqU8"
}

resource "cloudflare_worker_route" "route" {
  zone_id     = "0da42c8d2132a9ddaf714f9e7c920711"
  pattern     = "gdol.emonadeo.workers.dev/*"
  script_name = cloudflare_worker_script.gdol.name
}

resource "cloudflare_worker_script" "gdol" {
  name       = "gdol"
  account_id = "363a63b9c447a0da5928d76260a658fb"
  content    = file("dist/server.js")
  module     = true
}
