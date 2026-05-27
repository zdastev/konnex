--
-- PostgreSQL database dump
--

\restrict XgGjEYHXpjz4GJm150PtgUu1wXNSTg7BbxLtcYnNN2ctlJ6ppAGueHByfGWYCw0

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

--
-- Data for Name: categorias; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categorias (id, nombre, descripcion, created_at) FROM stdin;
1	Restaurantes	Negocios de comida y restauración	2026-05-26 17:22:20.135669
2	Peluquería canina	Peluquerías para mascotas	2026-05-26 17:22:20.135669
3	Peluquerías	Peluquerías para personas	2026-05-26 17:22:20.135669
\.


--
-- Data for Name: productos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.productos (id, nombre, descripcion, created_at) FROM stdin;
1	Carta QR	Menú digital con código QR	2026-05-26 17:22:20.135669
2	Página web	Diseño y desarrollo de sitio web	2026-05-26 17:22:20.135669
3	Agendamiento de citas	Servicio comercial de Konnex	2026-05-26 20:12:47.409839
\.


--
-- Data for Name: categoria_productos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categoria_productos (id, categoria_id, producto_id) FROM stdin;
4	1	1
5	1	2
6	2	2
7	3	2
8	2	3
\.


--
-- Data for Name: contactos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.contactos (id, nombre_negocio, whatsapp, ubicacion, tiene_web, categoria_id, created_at) FROM stdin;
1	la sazon	603176690	Valencia	f	1	2026-05-26 19:05:41.973619
\.


--
-- Data for Name: estados_contacto; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.estados_contacto (id, contacto_id, producto_id, estado, notas, updated_at) FROM stdin;
14	1	2	interesado	\N	2026-05-26 21:29:32.216242
1	1	1	sin_contactar	\N	2026-05-27 16:36:24.503819
\.


--
-- Data for Name: seguimientos_agenda; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.seguimientos_agenda (id, contacto_id, producto_id, fecha, tipo, notas, completado, created_at, updated_at) FROM stdin;
1	1	1	2026-05-27 22:27:00+02	llamada	quiere una reunión para ver	t	2026-05-26 21:28:18.948003+02	2026-05-26 21:28:39.885266+02
2	1	1	2026-05-27 22:46:00+02	llamada	videollamada	t	2026-05-26 21:46:55.444754+02	2026-05-26 21:47:22.053352+02
3	1	1	2026-05-26 22:47:00+02	llamada		t	2026-05-26 21:47:30.149137+02	2026-05-27 16:36:02.862679+02
\.


--
-- Name: categoria_productos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categoria_productos_id_seq', 8, true);


--
-- Name: categorias_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categorias_id_seq', 3, true);


--
-- Name: contactos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.contactos_id_seq', 1, true);


--
-- Name: estados_contacto_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.estados_contacto_id_seq', 20, true);


--
-- Name: productos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.productos_id_seq', 3, true);


--
-- Name: seguimientos_agenda_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.seguimientos_agenda_id_seq', 3, true);


--
-- PostgreSQL database dump complete
--

\unrestrict XgGjEYHXpjz4GJm150PtgUu1wXNSTg7BbxLtcYnNN2ctlJ6ppAGueHByfGWYCw0

