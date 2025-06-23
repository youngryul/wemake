-- trigger : 어떤 작업의 이벤트를 받아 그 이후의 작업을 실행
-- user 가 생성되고 난 후에 이벤트를 처리하는 trigger
create function public.handle_new_user()
    returns trigger
    language plpgsql
security definer
set search_path = ''
as $$
begin
    if new.raw_app_meta_data is not null then
        if new.raw_app_meta_data ? 'provider' AND new.raw_app_meta_data ->> 'provider' = 'email' then
            insert into public.profiles (profile_id, name, username, role)
            values (new.id, 'Anonymous', 'mr.' || substr(md5(random()::text), 1, 8), 'developer');
        end if;
    end if;
    return new;
end;
$$;

create trigger user_to_profile_trigger
    after insert on auth.users
    for each row execute function public.handle_new_user();