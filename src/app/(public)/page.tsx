import { getSettings } from "@/lib/services/settings";
import { getAbout } from "@/lib/services/about";
import { getFeaturedProjects } from "@/lib/services/projects";
import { getLatestPosts } from "@/lib/services/blog";
import { getFeaturedVideos } from "@/lib/services/videos";
import { getSkills } from "@/lib/services/skills";
import { HeroSection } from "@/components/home/hero-section";
import { StatsSection } from "@/components/home/stats-section";
import { AboutPreview } from "@/components/home/about-preview";
import { FeaturedProjects } from "@/components/home/featured-projects";
import { LatestBlog } from "@/components/home/latest-blog";
import { FeaturedVideos } from "@/components/home/featured-videos";
import { SkillsSection } from "@/components/home/skills-section";
import { ContactSection } from "@/components/home/contact-section";

export default async function HomePage() {
  const [settings, about, projects, posts, videos, skills] = await Promise.all([
    getSettings(),
    getAbout(),
    getFeaturedProjects(),
    getLatestPosts(),
    getFeaturedVideos(),
    getSkills(),
  ]);

  return (
    <>
      <HeroSection settings={settings} />
      {settings.sections.stats && <StatsSection settings={settings} />}
      {settings.sections.about && <AboutPreview about={about} />}
      {settings.sections.projects && <FeaturedProjects projects={projects} />}
      {settings.sections.videos && <FeaturedVideos videos={videos} />}
      {settings.sections.blog && <LatestBlog posts={posts} />}
      {settings.sections.skills && <SkillsSection skills={skills} />}
      {settings.sections.contact && <ContactSection />}
    </>
  );
}
