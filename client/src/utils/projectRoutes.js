export function getProjectSlug(project) {
  return (project.title || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function getProjectRouteKey(project) {
  if (!project) return '';
  const slug = getProjectSlug(project);
  return slug || String(project._id || project.id || '');
}

export function getProjectPath(project) {
  if (!project) return '/projects';
  return `/projects/${encodeURIComponent(getProjectRouteKey(project))}`;
}

export function getProjectFallbackImage(project) {
  const projectType = `${project.category || ''} ${project.finish || ''} ${project.title || ''}`.toLowerCase();

  if (projectType.includes('garage') || projectType.includes('flake')) {
    return '/images/epoxy-flake-garage.jpg';
  }
  if (projectType.includes('quartz') || projectType.includes('kitchen') || projectType.includes('brewery')) {
    return '/images/commercial-kitchen-quartz.jpg';
  }
  if (projectType.includes('metallic') || projectType.includes('showroom')) {
    return '/images/metallic-epoxy-floor.jpg';
  }
  if (projectType.includes('grind') || projectType.includes('preparation')) {
    return '/images/concrete-diamond-grinding.jpg';
  }
  return '/images/industrial-epoxy-warehouse.jpg';
}
