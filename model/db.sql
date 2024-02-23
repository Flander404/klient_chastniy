create table users(
 "id" serial primary key,
 "phone" text not null,
 UNIQUE(phone),
 "position" text not null,
 "inn" text not null,
 "litso" integer,
 "image" text,
 "type" text,
 "nomer_registratsiya" integer,
 "lastname" text,
 "firstname" text,
 "name" text,
 "balanse" integer default 0 not null,
 "komisiya" integer default 4 not null,
 "min-komisiya" integer default 4 not null,
 "super_admin" boolean default false not null,
 "time_create" timestamp default current_timestamp not null,
  "time_update" timestamp default current_timestamp not null
);
create table contact(
 "id" serial primary key,
 "phone" text not null,
 "companiy" text,
 "full_name" text,
 "comanda" text ,
  "time_create" timestamp default current_timestamp not null,
  "time_update" timestamp default current_timestamp not null
);
create table liso(
   "id" serial primary key,
"title" text not null,
 "time_create" timestamp default current_timestamp not null,
  "time_update" timestamp default current_timestamp not null
)
create table verify(
"id" serial primary key,
 "phone" varchar(50) not null,
 "code" integer not null,
  "time_create" timestamp default current_timestamp not null,
  "time_update" timestamp default current_timestamp not null  
)
create table companiy(
 "id" serial primary key,
 "image" text not null,
 "phone" text not null,
 "instagram" text not null,
 "facebook" text not null,
 "twitter" text not null,
 "youtube" text not null,
 "email" text not null, 
 "address" text not null,
 "time_create" timestamp default current_timestamp not null,
 "time_update" timestamp default current_timestamp not null
);
create table blog_category(
 "id" serial primary key,
"title" text not null,
 "time_create" timestamp default current_timestamp not null,
  "time_update" timestamp default current_timestamp not null
);
create table blogs(
 "id" serial primary key,
 "title" text not null,
 "time" timestamp default current_timestamp not null,
 "time_create" timestamp default current_timestamp not null,
 "time_update" timestamp default current_timestamp not null
);
create table blog_category_connect(
 "id" serial primary key,
 "blog_id" integer not null,
  UNIQUE (blog_id, category_id),
 "category_id" integer not null,
 "time_create" timestamp default current_timestamp not null,
 "time_update" timestamp default current_timestamp not null
);




create table document(
 "id" serial primary key,
 "user_id" integer not null,
 "title" text not null,
 "file" text not null,
 "time_create" timestamp default current_timestamp not null,
  "time_update" timestamp default current_timestamp not null
);

create table  hamkasb(
  "id" serial primary key,
  "user_id" integer not null,
   UNIQUE(hamkasb_id),
 "hamkasb_id" text not null,
 "time_create" timestamp default current_timestamp not null,
  "time_update" timestamp default current_timestamp not null
);
create table akti(
   "id" serial primary key,
  "user_id" integer not null,
  "psev" text not null,
  "time_create" timestamp default current_timestamp not null,
  "time_update" timestamp default current_timestamp not null
);
create table schet(
   "id" serial primary key,
  "user_id" integer not null,
  "date" text not null,
  "status" text not null,
  "type" text not null,
  "price" text not null,
  "time_create" timestamp default current_timestamp not null,
  "time_update" timestamp default current_timestamp not null
);


create table vigruzka(
   "id" serial primary key,
  "user_id" integer not null,
 "perexot" text not null,
 "tip" text not null,
 "teg" text not null,
 "status" text not null,
 "file" integer not null,
  "time_create" timestamp default current_timestamp not null,
  "time_update" timestamp default current_timestamp not null
);
create table balanse(
   "id" serial primary key,
  "user_id" integer not null,
  "tip" text not null,
  "status" text not null,
  "time_create" timestamp default current_timestamp not null,
  "time_update" timestamp default current_timestamp not null
);
create table ispolze(
   "id" serial primary key,
   "isporitel_category" integer not null,
  "user_id" integer not null,
  "tip" text not null,
  "status" integer not null,
  "nalogstatus" integer not null,
  "grajdanstvo" text not null,
  "med_knishka" text not null,
  "sprafka" text not null,
  "proyekt" text not null,
  "potpisdata" text not null,
  "time_create" timestamp default current_timestamp not null,
  "time_update" timestamp default current_timestamp not null
)