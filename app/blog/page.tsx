"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Nav } from "../components/nav";
import { Footer } from "../components/footer";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/*
 * This page will read from Supabase once the project is configured.
 * Schema: posts (id, title, slug, excerpt, cover_image, published, published_at, created_at)
 * Until then: graceful empty state.
 */

export default function BlogPage() {
  const reduce = useReducedMotion();

  const reveal = (delay = 0) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 50, filter: "blur(4px)" },
          whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
          viewport: { once: true, margin: "-60px" },
          transition: { duration: 0.85, ease: EASE, delay },
        };

  /* Replace `posts` with data fetched from Supabase when ready */
  const posts: {
    slug: string;
    title: string;
    excerpt: string | null;
    published_at: string;
  }[] = [];

  return (
    <>
      <Nav />
      <main>

        {/* ── Page intro ── */}
        <section className="px-6 md:px-12 lg:px-20 pt-40 pb-16">
          <div className="max-w-screen-xl mx-auto">
            <motion.div
              initial={reduce ? false : { scaleX: 0, originX: 0 }}
              animate={{ scaleX: 1 }}
              transition={reduce ? { duration: 0 } : { duration: 0.9, ease: EASE, delay: 0.1 }}
              className="h-px w-16 bg-accent mb-12"
              aria-hidden
            />
            <motion.h1
              initial={reduce ? false : { opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={reduce ? { duration: 0 } : { duration: 0.85, ease: EASE, delay: 0.18 }}
              className="font-wordmark text-[clamp(3rem,9vw,6rem)] leading-[0.9] tracking-[-0.02em] text-ink"
            >
              Writing
            </motion.h1>
            <motion.p
              initial={reduce ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={reduce ? { duration: 0 } : { duration: 0.8, ease: EASE, delay: 0.3 }}
              className="font-display italic text-muted text-[clamp(1rem,2vw,1.375rem)] mt-6 max-w-xl"
            >
              Thoughts on leadership, technology, and building things.
            </motion.p>
          </div>
        </section>

        {/* ── Post list or empty state ── */}
        <section className="px-6 md:px-12 lg:px-20 py-20 border-t border-faint/20">
          <div className="max-w-screen-xl mx-auto">

            {posts.length > 0 ? (
              <div className="flex flex-col">
                {posts.map((post, i) => (
                  <motion.article
                    key={post.slug}
                    {...reveal(i * 0.08)}
                    className="group py-12 border-b border-faint/20 last:border-b-0"
                  >
                    <a href={`/blog/${post.slug}`} className="block">
                      <div className="flex flex-col md:flex-row md:items-baseline md:gap-12">
                        <p className="font-sans text-[0.65rem] text-faint tracking-[0.12em] uppercase mb-3 md:mb-0 md:w-36 shrink-0">
                          {new Date(post.published_at).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                        <div className="flex-1">
                          <h2 className="font-display text-[clamp(1.25rem,2.5vw,2rem)] text-ink group-hover:text-accent transition-colors duration-300 leading-snug mb-3">
                            {post.title}
                          </h2>
                          {post.excerpt && (
                            <p className="font-sans text-sm text-muted leading-relaxed max-w-2xl">
                              {post.excerpt}
                            </p>
                          )}
                        </div>
                        <span
                          className="hidden md:block font-sans text-sm text-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300 shrink-0 self-center"
                          aria-hidden
                        >
                          Read →
                        </span>
                      </div>
                    </a>
                  </motion.article>
                ))}
              </div>
            ) : (
              /* Empty state */
              <motion.div
                {...reveal(0.1)}
                className="py-24 flex flex-col items-start gap-6 max-w-lg"
              >
                <motion.div
                  {...(reduce
                    ? {}
                    : {
                        animate: { scaleX: [0.6, 1, 0.6], opacity: [0.3, 0.6, 0.3] },
                        transition: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                      })}
                  className="h-px w-12 bg-accent/50"
                  aria-hidden
                />
                <p className="font-display italic text-[clamp(1.25rem,2.5vw,1.875rem)] text-muted leading-snug">
                  Posts are on their way.
                </p>
                <p className="font-sans text-sm text-faint leading-relaxed">
                  The writing section is being set up. Check back soon for thoughts
                  on leadership, technology, and building things from scratch.
                </p>
              </motion.div>
            )}

          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
