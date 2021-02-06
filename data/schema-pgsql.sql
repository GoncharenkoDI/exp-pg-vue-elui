-- Table: public.users

DROP TABLE IF EXISTS public.users;

CREATE TABLE public.users
(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    email character varying(255) COLLATE pg_catalog."default" NOT NULL,
    password character varying(64) COLLATE pg_catalog."default" NOT NULL,
    last_login date,
    login_state character varying(255) COLLATE pg_catalog."default",
    session_id character varying(1024) COLLATE pg_catalog."default",
    token character varying(1024) COLLATE pg_catalog."default",
    create_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT users_pk PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE public.users
    OWNER to postgres;


drop table if exists "auth_assignment";
drop table if exists "auth_item_child";
drop table if exists "auth_item";
DROP TABLE IF EXISTS public.auth_rule;

-- Table: public.auth_rule

CREATE TABLE public.auth_rule
(
    name character varying(64) COLLATE pg_catalog."default" NOT NULL,
    data bytea,
    create_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT auth_rule_pkey PRIMARY KEY (name)
)

TABLESPACE pg_default;

ALTER TABLE public.auth_rule
    OWNER to postgres;


DROP TABLE public.auth_item;

CREATE TABLE public.auth_item
(
    name character varying(64) COLLATE pg_catalog."default" NOT NULL,
    type smallint NOT NULL,
    description text COLLATE pg_catalog."default",
    rule_name character varying(64) COLLATE pg_catalog."default",
    data bytea,
    created_at integer,
    updated_at integer,
    CONSTRAINT auth_item_pkey PRIMARY KEY (name),
    CONSTRAINT auth_item_rule_name_fkey FOREIGN KEY (rule_name)
        REFERENCES public.auth_rule (name) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE SET NULL
)

TABLESPACE pg_default;

ALTER TABLE public.auth_item
    OWNER to postgres;
-- Index: auth_item_type_idx

-- DROP INDEX public.auth_item_type_idx;

CREATE INDEX auth_item_type_idx
    ON public.auth_item USING btree
    (type ASC NULLS LAST)
    TABLESPACE pg_default;

create index auth_item_type_idx on "auth_item" ("type");

create table "auth_item_child"
(
   "parent"               varchar(64) not null,
   "child"                varchar(64) not null,
   primary key ("parent","child"),
   foreign key ("parent") references "auth_item" ("name") on delete cascade on update cascade,
   foreign key ("child") references "auth_item" ("name") on delete cascade on update cascade
);

create table "auth_assignment"
(
   "item_name"            varchar(64) not null,
   "user_id"              uuid not null,
   "created_at"           bigint not null,
   primary key ("item_name","user_id"),
   foreign key ("item_name") references "auth_item" ("name") on delete cascade on update cascade
);