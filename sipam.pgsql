--
-- PostgreSQL database dump
--

-- Dumped from database version 11.2
-- Dumped by pg_dump version 11.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Data for Name: sipam_cidr; Type: TABLE DATA; Schema: public; Owner: sipam
--

COPY public.sipam_cidr (id, flag, created, edited, cidr, fqdn, description, pool_id) FROM stdin;
57df5b14-565f-4f89-a1d8-59d5b6f2bc51	reservation	2019-04-18 02:14:01.330762+02	2019-04-18 02:14:01.330778+02	2001:7c7:2100::/40	server.selfnet.de	This is the server zone	\N
4fd0edfd-0960-46e2-8854-d9b8cb6b95ad	reservation	2019-04-18 03:17:22.65981+02	2019-04-18 03:17:22.659843+02	2001:7c7:2100::/41			\N
3af36afd-97ae-4aed-aabc-b1d0f6bbadbd	reservation	2019-04-18 03:18:49.097251+02	2019-04-18 03:18:49.097274+02	2001:7c7:2100::/128			\N
8bd2dec6-b08d-4568-b640-dc49e9cbf6c4	reservation	2019-04-18 03:22:14.34149+02	2019-04-18 03:22:14.341532+02	10.1.1.0/31			\N
6159c829-55e1-4747-8cbb-87c0ccbcda12	reservation	2019-04-18 03:22:28.856748+02	2019-04-18 03:22:28.856792+02	10.1.1.1/32			\N
51a10af2-f1a9-4b4d-a625-4662a2c3b7ce	reservation	2019-04-18 03:22:34.760495+02	2019-04-18 03:25:56.071016+02	10.1.1.2/31			\N
15c48da1-39c8-44ac-8cea-737bd61ab386	reservation	2019-04-18 03:35:02.24778+02	2019-04-18 03:35:02.247797+02	10.1.1.0/32			\N
f6dbfc27-d317-4bc5-b534-d4f8bbc0ecbf	reservation	2019-04-18 05:18:13.816981+02	2019-04-18 05:18:13.817003+02	100.64.0.0/10			\N
f44f079b-c816-4261-887d-214df0234d08	reservation	2019-04-18 05:18:31.663327+02	2019-04-18 05:18:31.663349+02	100.64.0.0/16			\N
50a581d5-9a4f-469b-a404-3a734604f960	reservation	2019-04-18 05:18:38.481341+02	2019-04-18 05:18:38.481358+02	100.65.0.0/16			\N
85cfa9f7-2f08-4668-b7f0-03b51e1ed3c0	reservation	2019-04-18 05:18:51.527466+02	2019-04-18 05:18:51.527486+02	100.66.0.0/16			\N
f099e8c4-63f8-4426-849f-9995656d432a	reservation	2019-04-18 05:19:00.449737+02	2019-04-18 05:19:00.449776+02	100.67.0.0/16			\N
93d0f2fd-82fa-499e-9393-148f1b7ad130	reservation	2019-04-18 05:19:18.532444+02	2019-04-18 05:19:18.532461+02	100.68.0.0/16			\N
bd5a4193-cc4d-469d-9a81-1707e2d04b1d	reservation	2019-04-18 05:19:33.134791+02	2019-04-18 05:19:33.134813+02	100.68.24.0/21			\N
7170faae-93f3-486a-ba67-e6602e2d3e09	reservation	2019-04-18 05:20:07.555463+02	2019-04-18 05:20:07.555486+02	100.68.24.24/32			\N
553ddba3-a5b8-46c0-b3f3-5d6ba8498fa7	reservation	2019-04-19 16:40:20.538193+02	2019-04-19 16:40:20.538219+02	100.0.0.0/8			\N
7755005f-f412-4f94-b917-d8342e41d21b	reservation	2019-04-27 13:31:33.783913+02	2019-04-27 13:31:33.783945+02	10.0.0.0/8		asdf	\N
\.
