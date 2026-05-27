--
-- PostgreSQL database dump
--

\restrict otBVIomDfcFubvY4NOOv9br2GhO2cOPNwmOHeqIwWrIoBQSFnQdDRobDXS4YaWw

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: categoria_productos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categoria_productos (
    id integer NOT NULL,
    categoria_id integer,
    producto_id integer
);


ALTER TABLE public.categoria_productos OWNER TO postgres;

--
-- Name: categoria_productos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.categoria_productos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categoria_productos_id_seq OWNER TO postgres;

--
-- Name: categoria_productos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.categoria_productos_id_seq OWNED BY public.categoria_productos.id;


--
-- Name: categorias; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categorias (
    id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    descripcion text,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.categorias OWNER TO postgres;

--
-- Name: categorias_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.categorias_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categorias_id_seq OWNER TO postgres;

--
-- Name: categorias_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.categorias_id_seq OWNED BY public.categorias.id;


--
-- Name: contactos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.contactos (
    id integer NOT NULL,
    nombre_negocio character varying(150) NOT NULL,
    whatsapp character varying(20),
    ubicacion character varying(200),
    tiene_web boolean DEFAULT false,
    categoria_id integer,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.contactos OWNER TO postgres;

--
-- Name: contactos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.contactos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.contactos_id_seq OWNER TO postgres;

--
-- Name: contactos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.contactos_id_seq OWNED BY public.contactos.id;


--
-- Name: estados_contacto; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.estados_contacto (
    id integer NOT NULL,
    contacto_id integer,
    producto_id integer,
    estado character varying(20) DEFAULT 'sin_contactar'::character varying,
    notas text,
    updated_at timestamp without time zone DEFAULT now(),
    CONSTRAINT estados_contacto_estado_check CHECK (((estado)::text = ANY ((ARRAY['interesado'::character varying, 'no_interesa'::character varying, 'pensandolo'::character varying, 'sin_contactar'::character varying])::text[])))
);


ALTER TABLE public.estados_contacto OWNER TO postgres;

--
-- Name: estados_contacto_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.estados_contacto_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.estados_contacto_id_seq OWNER TO postgres;

--
-- Name: estados_contacto_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.estados_contacto_id_seq OWNED BY public.estados_contacto.id;


--
-- Name: productos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.productos (
    id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    descripcion text,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.productos OWNER TO postgres;

--
-- Name: productos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.productos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.productos_id_seq OWNER TO postgres;

--
-- Name: productos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.productos_id_seq OWNED BY public.productos.id;


--
-- Name: seguimientos_agenda; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.seguimientos_agenda (
    id integer NOT NULL,
    contacto_id integer NOT NULL,
    producto_id integer,
    fecha timestamp with time zone NOT NULL,
    tipo character varying(50) NOT NULL,
    notas text,
    completado boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT chk_tipo_seguimiento CHECK (((tipo)::text = ANY ((ARRAY['llamada'::character varying, 'email'::character varying, 'reunion'::character varying, 'tarea'::character varying])::text[])))
);


ALTER TABLE public.seguimientos_agenda OWNER TO postgres;

--
-- Name: seguimientos_agenda_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.seguimientos_agenda_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.seguimientos_agenda_id_seq OWNER TO postgres;

--
-- Name: seguimientos_agenda_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.seguimientos_agenda_id_seq OWNED BY public.seguimientos_agenda.id;


--
-- Name: categoria_productos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categoria_productos ALTER COLUMN id SET DEFAULT nextval('public.categoria_productos_id_seq'::regclass);


--
-- Name: categorias id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categorias ALTER COLUMN id SET DEFAULT nextval('public.categorias_id_seq'::regclass);


--
-- Name: contactos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contactos ALTER COLUMN id SET DEFAULT nextval('public.contactos_id_seq'::regclass);


--
-- Name: estados_contacto id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estados_contacto ALTER COLUMN id SET DEFAULT nextval('public.estados_contacto_id_seq'::regclass);


--
-- Name: productos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.productos ALTER COLUMN id SET DEFAULT nextval('public.productos_id_seq'::regclass);


--
-- Name: seguimientos_agenda id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.seguimientos_agenda ALTER COLUMN id SET DEFAULT nextval('public.seguimientos_agenda_id_seq'::regclass);


--
-- Name: categoria_productos categoria_productos_categoria_id_producto_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categoria_productos
    ADD CONSTRAINT categoria_productos_categoria_id_producto_id_key UNIQUE (categoria_id, producto_id);


--
-- Name: categoria_productos categoria_productos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categoria_productos
    ADD CONSTRAINT categoria_productos_pkey PRIMARY KEY (id);


--
-- Name: categorias categorias_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categorias
    ADD CONSTRAINT categorias_pkey PRIMARY KEY (id);


--
-- Name: contactos contactos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contactos
    ADD CONSTRAINT contactos_pkey PRIMARY KEY (id);


--
-- Name: estados_contacto estados_contacto_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estados_contacto
    ADD CONSTRAINT estados_contacto_pkey PRIMARY KEY (id);


--
-- Name: productos productos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.productos
    ADD CONSTRAINT productos_pkey PRIMARY KEY (id);


--
-- Name: seguimientos_agenda seguimientos_agenda_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.seguimientos_agenda
    ADD CONSTRAINT seguimientos_agenda_pkey PRIMARY KEY (id);


--
-- Name: estados_contacto unique_contacto_producto; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estados_contacto
    ADD CONSTRAINT unique_contacto_producto UNIQUE (contacto_id, producto_id);


--
-- Name: idx_seguimientos_agenda_contacto; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_seguimientos_agenda_contacto ON public.seguimientos_agenda USING btree (contacto_id);


--
-- Name: idx_seguimientos_agenda_fecha; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_seguimientos_agenda_fecha ON public.seguimientos_agenda USING btree (fecha);


--
-- Name: idx_seguimientos_agenda_producto; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_seguimientos_agenda_producto ON public.seguimientos_agenda USING btree (producto_id);


--
-- Name: categoria_productos categoria_productos_categoria_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categoria_productos
    ADD CONSTRAINT categoria_productos_categoria_id_fkey FOREIGN KEY (categoria_id) REFERENCES public.categorias(id) ON DELETE CASCADE;


--
-- Name: categoria_productos categoria_productos_producto_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categoria_productos
    ADD CONSTRAINT categoria_productos_producto_id_fkey FOREIGN KEY (producto_id) REFERENCES public.productos(id) ON DELETE CASCADE;


--
-- Name: contactos contactos_categoria_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contactos
    ADD CONSTRAINT contactos_categoria_id_fkey FOREIGN KEY (categoria_id) REFERENCES public.categorias(id) ON DELETE SET NULL;


--
-- Name: estados_contacto estados_contacto_contacto_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estados_contacto
    ADD CONSTRAINT estados_contacto_contacto_id_fkey FOREIGN KEY (contacto_id) REFERENCES public.contactos(id) ON DELETE CASCADE;


--
-- Name: estados_contacto estados_contacto_producto_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estados_contacto
    ADD CONSTRAINT estados_contacto_producto_id_fkey FOREIGN KEY (producto_id) REFERENCES public.productos(id) ON DELETE CASCADE;


--
-- Name: seguimientos_agenda seguimientos_agenda_contacto_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.seguimientos_agenda
    ADD CONSTRAINT seguimientos_agenda_contacto_id_fkey FOREIGN KEY (contacto_id) REFERENCES public.contactos(id) ON DELETE CASCADE;


--
-- Name: seguimientos_agenda seguimientos_agenda_producto_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.seguimientos_agenda
    ADD CONSTRAINT seguimientos_agenda_producto_id_fkey FOREIGN KEY (producto_id) REFERENCES public.productos(id) ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

\unrestrict otBVIomDfcFubvY4NOOv9br2GhO2cOPNwmOHeqIwWrIoBQSFnQdDRobDXS4YaWw

