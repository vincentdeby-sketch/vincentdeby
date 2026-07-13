
CREATE INDEX IF NOT EXISTS articles_published_pubat_idx
  ON public.articles (published_at DESC NULLS LAST)
  WHERE published = true;

CREATE INDEX IF NOT EXISTS articles_published_slug_idx
  ON public.articles (slug)
  WHERE published = true;

CREATE INDEX IF NOT EXISTS properties_published_created_idx
  ON public.properties (created_at DESC)
  WHERE published = true;

CREATE INDEX IF NOT EXISTS estimations_created_idx
  ON public.estimations (created_at DESC);
