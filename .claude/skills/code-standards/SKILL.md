---
name: code-standards
description: Reviews code changes for potential deviation from the standards that keep this Project Hub codebase clean and tidy.  Use when planning, proposing, or reviewing new features or significant changes to existing code.
---

When planning or proposing changes to the Project Hub codebase that new pages, new templates, new components, new routes, or signficant refactoring of existing code:

## Keep it clean and simple

This is not a commercial product serving the needs of a diverse install base. It is not built by or for professional web developers. This is a small internal project designed for access and extensibility primarily by internal Vimeo sales engineering colleagues. The audience is technically savvy, but they are not fluent JS programmers. The goal is to make it easy for them to understand the code, add new features, and maintain the project over time. With that in mind:

1. Do not introduce new features or architecture that make the project technically “impressive” or trendy in a way that makes it less usable or more complex for its non-developer authors and maintainers.

2. It almost certainly does not need modern frameworks and complications such as microservices, Docker, React, Next.js, TypeScript, serverless deployment, animation libraries, charting libraries (without relevant chart data), or similar technologies that would look good on a resume but would have no meaningful impact on the project beyond adding complication.

3. What it does need are clean routes, clean data model, reusable templates, reusable CSS, secure handling of secrets, clear README documentation, simple deployment notes, and a predictable way to add the next tool.

4. Before introducing new third-party libraries or dependencies, always review the impact of such a "complexity" with the user, weigh the cost of complexity against the value of the problem it solves, and compare it to alternative solutions using vanilla JS, existing functionality, or foregoing the capability entirely. It's okay to add new features if the value proposition is there and the user agrees with your reasoning.

The polished version of this project should look modern on the surface, but under the hood it should be almost boring. That is what makes it maintainable.

## Ensure consistency in design patterns, naming conventions, and schemas

1. Functions, elements, components, and routes should have descriptive names that follow the existing naming patterns and structure in the codebase.

2. CSS class names should follow the existing Block-Element-Modifier convention to ensure that reusable components are easy to identify, understand, and utilize by other project collaborators.

## Prioritize long-term code consistency, simplicity, and maintainability of the project

1. Review the proposed solution with an eye toward maintainability by a non-professional developer.

2. Look for opportunities to avoid or resolve overengineering, unclear naming, duplicated patterns, unnecessary dependencies, fragile routing, and security issues.

3. Find places where this codebase violates its own conventions.

4. Look for duplicate CSS patterns, inconsistent route naming, unused dependencies, hard-coded project data, and anything that would make future project additions harder.

