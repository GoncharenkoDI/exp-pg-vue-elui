-- Table: public.users

DROP TABLE IF EXISTS public.refreshsessions;
DROP TABLE IF EXISTS public.users;

-- SEQUENCE: public.refreshsessions_id_seq

DROP SEQUENCE IF EXISTS public.refreshsessions_id_seq;

CREATE SEQUENCE public.refreshsessions_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 2147483647
    CACHE 1;

ALTER SEQUENCE public.refreshsessions_id_seq
    OWNER TO postgres;

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
    CONSTRAINT users_pk PRIMARY KEY (id),
    CONSTRAINT email_unique UNIQUE (email)
)

TABLESPACE pg_default;

ALTER TABLE public.users
    OWNER to postgres;

-- Table: public.refreshsessions

-- DROP TABLE public.refreshsessions;
/*
Сессія створюється методом POST/api/auth/login
оновлюється, POST/api/auth/refresh
видаляється POST/api/auth/logout/ body {user_id, fingerprint, refresh_token}
*/
CREATE TABLE public.refreshsessions
(
    id integer NOT NULL DEFAULT nextval('public.refreshsessions_id_seq'::regclass),
    user_id uuid NOT NULL,
    refresh_token uuid NOT NULL,
    user_agent character varying(200) COLLATE pg_catalog."default" NOT NULL,
    fingerprint character varying(200) COLLATE pg_catalog."default" NOT NULL,
    ip character varying(15) COLLATE pg_catalog."default" NOT NULL,
    expires_in bigint NOT NULL,
    create_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT refreshsessions_pkey PRIMARY KEY (id),
    CONSTRAINT refreshsessions_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE public.refreshsessions
    OWNER to postgres;

drop table if exists public.auth_assignment;
drop table if exists public.auth_item_child;
drop table if exists public.auth_item;
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


-- DROP TABLE public.auth_item;

CREATE TABLE public.auth_item
(
    name character varying(64) COLLATE pg_catalog."default" NOT NULL,
    type smallint NOT NULL,
    description text COLLATE pg_catalog."default",
    rule_name character varying(64) COLLATE pg_catalog."default",
    data bytea,
    create_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
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

-- Table: public.auth_item_child

-- DROP TABLE public.auth_item_child;

CREATE TABLE public.auth_item_child
(
    parent character varying(64) COLLATE pg_catalog."default" NOT NULL,
    child character varying(64) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT auth_item_child_pkey PRIMARY KEY (parent, child),
    CONSTRAINT auth_item_child_child_fkey FOREIGN KEY (child)
        REFERENCES public.auth_item (name) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT auth_item_child_parent_fkey FOREIGN KEY (parent)
        REFERENCES public.auth_item (name) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE public.auth_item_child
    OWNER to postgres;

-- Table: public.auth_assignment

-- DROP TABLE public.auth_assignment;

CREATE TABLE public.auth_assignment
(
    item_name character varying(64) COLLATE pg_catalog."default" NOT NULL,
    user_id uuid NOT NULL,
    create_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT auth_assignment_pkey PRIMARY KEY (item_name, user_id),
    CONSTRAINT auth_assignment_item_name_fkey FOREIGN KEY (item_name)
        REFERENCES public.auth_item (name) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE public.auth_assignment
    OWNER to postgres;