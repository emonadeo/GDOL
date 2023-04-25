schema "main" {}

table "users" {
  schema = schema.main
  column "id" {
    type = integer
    null = false
    auto_increment = true
  }
  column "name" {
    type = text
    null = false
  }
  column "nationality" {
    type = text
    null = true
  }
  column "discord_id" {
    type = text
    null = true
  }
  primary_key {
    columns = [column.id]
  }
}

table "levels" {
  schema = schema.main
  column "id" {
    type = integer
    null = false
    auto_increment = true
  }
  column "name" {
    type = text
    null = false
  }
  column "gd_id" {
    type = integer
    null = true
  }
  column "user_id" {
    type = integer
    null = false
  }
  column "verifier_id" {
    type = integer
    null = false
  }
  column "video" {
    type = text
    null = true
  }
  column "requirement" {
    type = integer
    null = true
  }
  primary_key {
    columns = [column.id]
  }
  foreign_key "user_id" {
    columns = [column.user_id]
    ref_columns = [table.users.column.id]
  }
  foreign_key "verifier_id" {
    columns = [column.verifier_id]
    ref_columns = [table.users.column.id]
  }
}

table "user_created_level" {
  schema = schema.main
  column "user_id" {
    type = integer
    null = false
  }
  column "level_id" {
    type = integer
    null = false
  }
  primary_key {
    columns = [column.user_id, column.level_id]
  }
  foreign_key "user_id" {
    columns = [column.user_id]
    ref_columns = [table.users.column.id]
  }
  foreign_key "level_id" {
    columns = [column.level_id]
    ref_columns = [table.levels.column.id]
  }
}

table "records" {
  schema = schema.main
  column "timestamp" {
    type = integer
    null = false
  }
  column "percentage" {
    type = integer
    null = false
  }
  column "video" {
    type = text
    null = true
  }
  column "user_id" {
    type = integer
    null = false
  }
  column "level_id" {
    type = integer
    null = false
  }
  primary_key {
    columns = [column.user_id, column.level_id]
  }
  foreign_key "user_id" {
    columns = [column.user_id]
    ref_columns = [table.users.column.id]
  }
  foreign_key "level_id" {
    columns = [column.level_id]
    ref_columns = [table.levels.column.id]
  }
}

table "list_archive" {
  schema = schema.main
  column "level_id" {
    type = integer
    null = false
  }
  column "timestamp" {
    type = integer
    null = false
  }
  primary_key {
    columns = [column.level_id]
  }
  foreign_key "level_id" {
    columns = [column.level_id]
    ref_columns = [table.levels.column.id]
  }
}

table "list_log" {
  schema = schema.main
  column "id" {
    type = integer
    null = false
    auto_increment = true
  }
  column "list_level_ids" {
    type = text
    null = false
  }
  column "timestamp" {
    type = integer
    null = false
  }
  column "action" {
    type = text
    null = false
  }
  column "level_id" {
    type = integer
    null = false
  }
  column "from"{
    type = integer
    null = true
  }
  column "to"{
    type = integer
    null = true
  }
  column "reason" {
    type = text
    null = true
  }
  primary_key {
    columns = [column.id]
  }
  foreign_key "level_id" {
    columns = [column.level_id]
    ref_columns = [table.levels.column.id]
  }
}
