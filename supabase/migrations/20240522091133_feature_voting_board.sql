create table "public"."features" (
    "id" bigint generated by default as identity not null,
    "title" text not null,
    "description" text not null,
    "created_at" timestamp with time zone not null default now(),
    "upvotes" bigint not null default '0'::bigint
);


alter table "public"."features" enable row level security;

create table "public"."votes" (
    "id" bigint generated by default as identity not null,
    "user_id" uuid not null default auth.uid(),
    "feature_id" bigint not null,
    "created_at" timestamp with time zone not null default now()
);


alter table "public"."votes" enable row level security;

CREATE UNIQUE INDEX features_pkey ON public.features USING btree (id);

CREATE UNIQUE INDEX votes_pkey ON public.votes USING btree (id);

alter table "public"."features" add constraint "features_pkey" PRIMARY KEY using index "features_pkey";

alter table "public"."votes" add constraint "votes_pkey" PRIMARY KEY using index "votes_pkey";

alter table "public"."votes" add constraint "votes_feature_id_fkey" FOREIGN KEY (feature_id) REFERENCES features(id) not valid;

alter table "public"."votes" validate constraint "votes_feature_id_fkey";

alter table "public"."votes" add constraint "votes_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table "public"."votes" validate constraint "votes_user_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.decrement_upvotes(feature_id integer)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
  UPDATE features SET upvotes = upvotes - 1 WHERE id = feature_id;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.increment_upvotes(feature_id integer)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
  UPDATE features SET upvotes = upvotes + 1 WHERE id = feature_id;
END;
$function$
;

grant delete on table "public"."features" to "anon";

grant insert on table "public"."features" to "anon";

grant references on table "public"."features" to "anon";

grant select on table "public"."features" to "anon";

grant trigger on table "public"."features" to "anon";

grant truncate on table "public"."features" to "anon";

grant update on table "public"."features" to "anon";

grant delete on table "public"."features" to "authenticated";

grant insert on table "public"."features" to "authenticated";

grant references on table "public"."features" to "authenticated";

grant select on table "public"."features" to "authenticated";

grant trigger on table "public"."features" to "authenticated";

grant truncate on table "public"."features" to "authenticated";

grant update on table "public"."features" to "authenticated";

grant delete on table "public"."features" to "service_role";

grant insert on table "public"."features" to "service_role";

grant references on table "public"."features" to "service_role";

grant select on table "public"."features" to "service_role";

grant trigger on table "public"."features" to "service_role";

grant truncate on table "public"."features" to "service_role";

grant update on table "public"."features" to "service_role";

grant delete on table "public"."votes" to "anon";

grant insert on table "public"."votes" to "anon";

grant references on table "public"."votes" to "anon";

grant select on table "public"."votes" to "anon";

grant trigger on table "public"."votes" to "anon";

grant truncate on table "public"."votes" to "anon";

grant update on table "public"."votes" to "anon";

grant delete on table "public"."votes" to "authenticated";

grant insert on table "public"."votes" to "authenticated";

grant references on table "public"."votes" to "authenticated";

grant select on table "public"."votes" to "authenticated";

grant trigger on table "public"."votes" to "authenticated";

grant truncate on table "public"."votes" to "authenticated";

grant update on table "public"."votes" to "authenticated";

grant delete on table "public"."votes" to "service_role";

grant insert on table "public"."votes" to "service_role";

grant references on table "public"."votes" to "service_role";

grant select on table "public"."votes" to "service_role";

grant trigger on table "public"."votes" to "service_role";

grant truncate on table "public"."votes" to "service_role";

grant update on table "public"."votes" to "service_role";

create policy "Enable read access for authenticated users"
on "public"."features"
as permissive
for select
to authenticated
using (true);


create policy "Enable update access for all authenticated users"
on "public"."features"
as permissive
for update
to authenticated
using (true);


create policy "Enable delete for users based on user_id"
on "public"."votes"
as permissive
for delete
to authenticated
using ((auth.uid() = user_id));


create policy "Enable insert for authenticated users only"
on "public"."votes"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read access for all users"
on "public"."votes"
as permissive
for select
to public
using (true);



