--1. select id, nume from trasee -- toate traseele
select id_traseu,nume_traseu from trasee;
--2. select coordonate pentru fiecare traseu folosind id-ul de la 1-- 
select coordonate pentru fiecare traseu folosind id-ul de la 1-- 
select a.id_traseu, b.nume_traseu,b.lat1, b.longit1, b.lat2, b.longit2, b.lat3, b.longit3, b.lat4, b.longit4, b.lat5, b.longit5, b.lat6, b.longit6
b.lat7, b.longit7, b.lat8, b.longit8, b.lat9,b.longit9, b.lat10, b.longit10
 from trasee a, coordonate b  where a.id_traseu=b.id_traseu and a.id_traseu in (select id_traseu from trasee);--aici se pune id-ul traseului
--3. select detalii+coordonate pentru fiecare traseu in functie de un id_traseu
select t.nume_traseu, t.distanta, d.info_cand, d.info_unde, d.info_trafic, d.info_caini, d.info_lumini, d.info_siguranta,d.info_obs, c.lat1, c.longit1, c.lat2, c.longit2, c.lat3, c.longit3, c.lat4, c.longit4, c.lat5, c.longit5, c.lat6, c.longit6,
c.lat7, c.longit7, c.lat8, c.longit8, c.lat9,c.longit9, c.lat10, c.longit10 from detalii_traseu d, coordonate c, trasee t where d.id_traseu=c.id_traseu and t.id_traseu=c.id_traseu and c.id_traseu=1;
