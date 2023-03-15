-- TODO: Make configurable
CREATE
OR REPLACE FUNCTION calc_score(
    rank smallint,
    requirement smallint,
    percentage smallint
) RETURNS float AS $$
declare
    beaten_score float := 0;

b constant float := 6.273;

c constant float := 1.0099685;

d constant float := 31.152;

e constant float := 1.168;

f constant float := 100.39;

g constant float := 1.036;

h constant float := 25.071;

l constant float := 3.912023005428146;

begin
    if percentage != 100
    and rank > 75 then return 0.0;

end if;

if 55 < rank
and rank <= 150 then beaten_score = 56.191 * 2 ^((54.147 - (rank + 3.2)) * (l / 99)) + b;

elseif 35 < rank
and rank <= 55 then beaten_score = 212.61 * g ^(1 - rank) + h;

elseif 20 < rank
and rank <= 35 then beaten_score = (250 - 83.389) * c ^(2 - rank) - d;

elseif 0 < rank
and rank <= 20 then beaten_score = (250 - f) * e ^(1 - rank) + f;

end if;

if percentage != 100 then return beaten_score * 5 ^((percentage - requirement) / (100 - requirement)) / 10;

end if;

return beaten_score;

end $$ LANGUAGE plpgsql;