// SPDX-License-Identifier: Apache-2.0
// SPDX-FileCopyrightText: 2024-present The UDS Authors
import { describe, expect, it } from 'vitest';
import { sortApplicationsAlphabetically, truncateString } from './helpers';
import { type Application, Architecture, Category, Infrastructure } from '$lib/types';

describe('AppCard', () => {
  const description =
    'GitLab Runner is a powerful, open-source automation tool that executes jobs\nin your CI/CD pipelines. It works seamlessly with GitLab, allowing you to build,\ntest, and deploy your code efficiently. GitLab Runner supports multiple programming\nlanguages, can run on various operating systems, and offers flexible deployment\noptions including Docker containers and Kubernetes clusters. With its scalable\narchitecture and robust feature set, GitLab Runner helps development teams\nstreamline their workflows and deliver high-quality software faster.\n';

  const truncatedExpected =
    'GitLab Runner is a powerful, open-source automation tool that executes jobs in your CI/CD pipelines. It works seamlessly with GitLab, allowing you...';

  it('truncates the text', () => {
    const truncated = truncateString(description, 150);
    expect(truncated.length).toBeLessThanOrEqual(150);
    expect(truncatedExpected.length).toBeLessThanOrEqual(150);
    expect(truncated).toBe(truncatedExpected);
  });
});

describe('sortApplicationsAlphabetically', () => {
  const app1: Application = {
    metadata: { name: 'apple' },
    spec: {
      title: 'Apple',
      description: 'This is apple',
      vendor: { name: 'Vendor 1', url: 'https://vendor1.com' },
      categories: [Category.Security],
      infrastructure: [Infrastructure.OnPrem],
      architecture: [Architecture.Amd64]
    }
  } as Application;

  const app2: Application = {
    metadata: { name: 'Banana' },
    spec: {
      title: 'Banana',
      description: 'This is Banana',
      vendor: { name: 'Vendor 2', url: 'https://vendor2.com' },
      categories: [Category.Arcade],
      infrastructure: [Infrastructure.AWSGovCloudUS],
      architecture: [Architecture.Arm64]
    }
  } as Application;

  const app3: Application = {
    metadata: { name: 'Cherry' },
    spec: {
      title: 'Cherry',
      description: 'This is Cherry',
      vendor: { name: 'Vendor 3', url: 'https://vendor3.com' },
      categories: [Category.Web],
      infrastructure: [Infrastructure.OnPrem],
      architecture: [Architecture.Arm64]
    }
  } as Application;

  it('should sort applications alphabetically by title', () => {
    const applications: Application[] = [app2, app1, app3];

    const sorted = sortApplicationsAlphabetically(applications);

    expect(sorted[0].spec?.title).toBe(app1.spec?.title);
    expect(sorted[1].spec?.title).toBe(app2.spec?.title);
    expect(sorted[2].spec?.title).toBe(app3.spec?.title);
  });

  it('should sort applications alphabetically by name if there is no title', () => {
    const app2Title = { ...app2, spec: { ...app2.spec, title: undefined } };
    const applications: Application[] = [app2Title, app1, app3];

    const sorted = sortApplicationsAlphabetically(applications);

    expect(sorted[0].spec?.title).toBe(app1.spec?.title);
    expect(sorted[1].metadata?.name).toBe(app2.metadata?.name);
    expect(sorted[2].spec?.title).toBe(app3.spec?.title);
  });

  it('should handle applications with identical titles', () => {
    const applications: Application[] = [app2, app2, app1];

    const sorted = sortApplicationsAlphabetically(applications);

    expect(sorted[0].spec?.title).toBe(app1.spec?.title);
    expect(sorted[1].spec?.title).toBe(app2.spec?.title);
    expect(sorted[2].spec?.title).toBe(app2.spec?.title);
  });

  it('should be case insensitive when using titles', () => {
    const app2Lowercase = {
      ...app2,
      spec: { ...app2.spec, title: app2.spec?.title?.toLowerCase() }
    };
    const app3Lowercase = {
      ...app3,
      spec: { ...app3.spec, title: app3.spec?.title?.toLowerCase() }
    };
    const applications: Application[] = [app2Lowercase, app1, app3Lowercase];

    const sorted = sortApplicationsAlphabetically(applications);

    expect(sorted[0].spec?.title).toBe(app1.spec?.title);
    expect(sorted[1].spec?.title).toBe(app2Lowercase.spec?.title);
    expect(sorted[2].spec?.title).toBe(app3Lowercase.spec?.title);
  });

  it('should be case insensitive when using names', () => {
    const app2Lowercase = { ...app2, metadata: { name: app2.metadata?.name?.toLowerCase() } };
    const app3Lowercase = { ...app3, metadata: { name: app3.metadata?.name?.toLowerCase() } };
    const applications: Application[] = [app2Lowercase, app1, app3Lowercase];

    const sorted = sortApplicationsAlphabetically(applications);

    expect(sorted[0].metadata?.name).toBe(app1.metadata?.name);
    expect(sorted[1].metadata?.name).toBe(app2Lowercase.metadata?.name);
    expect(sorted[2].metadata?.name).toBe(app3Lowercase.metadata?.name);
  });

  it('should return an empty array when given an empty array', () => {
    const applications: Application[] = [];
    const sorted = sortApplicationsAlphabetically(applications);
    expect(sorted).toEqual([]);
  });
});
