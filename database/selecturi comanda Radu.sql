--1. select id, nume from trasee -- toate traseele
select id_traseu,nume_traseu from trasee;
--2. select coordonate pentru fiecare traseu folosind id-ul de la 1-- 
select lat1, longit1, lat2, longit2, lat3, longit3, lat4, longit4, lat5, longit5, lat6, longit6
lat7, longit7, lat8, longit8, lat9,longit9, lat10, longit10 from coordonate where id_traseu=;
--3. select detalii+coordonate pentru fiecare traseu in functie de un id_traseu
select t.nume_traseu,d.info_cand, d.info_unde, d.info_trafic, d.info_caini, d.info_lumini, d.info_siguranta,d.info_obs, c.lat1, c.longit1, c.lat2, c.longit2, c.lat3, c.longit3, c.lat4, c.longit4, c.lat5, c.longit5, c.lat6, c.longit6,
c.lat7, c.longit7, c.lat8, c.longit8, c.lat9,c.longit9, c.lat10, c.longit10 from detalii_traseu d, coordonate c, trasee t where d.id_traseu=c.id_traseu and t.id_traseu=c.id_traseu and c.id_traseu=1;
