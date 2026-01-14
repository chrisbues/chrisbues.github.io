---
title: "Advanced Tables with Grid.js"
description: "Interactive tables with search, sort, and pagination"
weight: 10
gridjs: true
draft: true
---

This page demonstrates the Grid.js integration for creating advanced, interactive tables in your Hextra documentation.

## Markdown Table Syntax (Recommended)

The easiest way to create a Grid.js table—just write a standard markdown table:

{{< gridjs-md >}}
| Name | Role | Department | Location |
|------|------|------------|----------|
| Alice Johnson | Software Engineer | Engineering | San Francisco |
| Bob Smith | Product Manager | Product | New York |
| Carol Williams | UX Designer | Design | Austin |
| David Brown | DevOps Engineer | Engineering | Seattle |
| Eva Martinez | Data Scientist | Analytics | Boston |
| Frank Lee | Frontend Developer | Engineering | San Francisco |
{{< /gridjs-md >}}

### Markdown Table with Options

Add pagination, fixed height, or disable features:

{{< gridjs-md pagination="5" >}}
| Product | Category | Price | Stock | Rating |
|---------|----------|-------|-------|--------|
| Wireless Mouse | Electronics | $29.99 | 150 | 4.5 |
| Mechanical Keyboard | Electronics | $89.99 | 75 | 4.8 |
| USB-C Hub | Electronics | $45.99 | 200 | 4.2 |
| Monitor Stand | Accessories | $34.99 | 120 | 4.0 |
| Webcam HD | Electronics | $59.99 | 90 | 4.6 |
| Desk Lamp | Accessories | $24.99 | 180 | 4.3 |
| Mouse Pad XL | Accessories | $19.99 | 300 | 4.7 |
| Laptop Stand | Accessories | $49.99 | 60 | 4.4 |
| Headphone Stand | Accessories | $15.99 | 250 | 3.9 |
| Cable Kit | Accessories | $12.99 | 400 | 4.1 |
{{< /gridjs-md >}}

### Inline Column Configuration

Configure columns directly in the header using `{key=value}` syntax:

{{< gridjs-md pagination="5" >}}
| Server {width=130px} | IP {width=120px} | Status {width=90px} | Description {wrap=constrained} |
|----------------------|------------------|---------------------|--------------------------------|
| web-prod-01 | 192.168.1.10 | Active | Primary production web server with nginx |
| web-prod-02 | 192.168.1.11 | Active | Secondary web server for load balancing |
| db-master | 192.168.1.20 | Active | PostgreSQL primary database server with streaming replication |
| db-replica | 192.168.1.21 | Active | PostgreSQL read replica for reporting |
| cache-01 | 192.168.1.30 | Active | Redis cache cluster for session storage |
| api-gateway | 192.168.1.40 | Warning | Kong API gateway - certificate expiring soon |
| monitor | 192.168.1.50 | Active | Prometheus and Grafana monitoring stack |
{{< /gridjs-md >}}

Supported inline options: `width`, `wrap`, `sort=false`, `hidden=true`

---

## JSON Data Format

For programmatic data or complex configurations, use JSON arrays:

### Basic Table with Search and Sort

A simple table with inline data. Search and sort are enabled by default.

{{< gridjs columns=`["Name", "Role", "Department", "Location"]` >}}
[
  ["Alice Johnson", "Software Engineer", "Engineering", "San Francisco"],
  ["Bob Smith", "Product Manager", "Product", "New York"],
  ["Carol Williams", "UX Designer", "Design", "Austin"],
  ["David Brown", "DevOps Engineer", "Engineering", "Seattle"],
  ["Eva Martinez", "Data Scientist", "Analytics", "Boston"],
  ["Frank Lee", "Frontend Developer", "Engineering", "San Francisco"],
  ["Grace Kim", "Backend Developer", "Engineering", "Seattle"],
  ["Henry Chen", "QA Engineer", "Engineering", "Austin"]
]
{{< /gridjs >}}

### Table with Pagination

For larger datasets, enable pagination to improve readability.

{{< gridjs columns=`["ID", "Product", "Category", "Price", "Stock"]` pagination="5" >}}
[
  ["P001", "Wireless Mouse", "Electronics", "$29.99", "In Stock"],
  ["P002", "Mechanical Keyboard", "Electronics", "$89.99", "In Stock"],
  ["P003", "USB-C Hub", "Electronics", "$45.99", "Low Stock"],
  ["P004", "Monitor Stand", "Accessories", "$34.99", "In Stock"],
  ["P005", "Webcam HD", "Electronics", "$59.99", "In Stock"],
  ["P006", "Desk Lamp", "Accessories", "$24.99", "In Stock"],
  ["P007", "Mouse Pad XL", "Accessories", "$19.99", "In Stock"],
  ["P008", "Laptop Stand", "Accessories", "$49.99", "Low Stock"],
  ["P009", "Headphone Stand", "Accessories", "$15.99", "In Stock"],
  ["P010", "Cable Management Kit", "Accessories", "$12.99", "In Stock"],
  ["P011", "External SSD 1TB", "Storage", "$99.99", "In Stock"],
  ["P012", "USB Flash Drive 64GB", "Storage", "$14.99", "In Stock"]
]
{{< /gridjs >}}

## External Data File

For large tables, store data in JSON files under `data/tables/`:

{{< gridjs-data data="servers" pagination="10" height="400px" fixedHeader="true" >}}

The data above is loaded from `data/tables/servers.json`. This approach:
- Keeps your Markdown files clean
- Makes data easier to maintain
- Allows reuse across multiple pages
- Supports programmatic data generation

## Fixed Height with Scrolling

When you have a lot of data, use fixed height with scroll:

{{< gridjs columns=`["Timestamp", "Level", "Service", "Message"]` height="250px" fixedHeader="true" >}}
[
  ["2024-12-25 10:00:01", "INFO", "api-gateway", "Request received: GET /api/v1/users"],
  ["2024-12-25 10:00:02", "DEBUG", "auth-service", "Token validation successful"],
  ["2024-12-25 10:00:02", "INFO", "user-service", "Fetching user profile id=12345"],
  ["2024-12-25 10:00:03", "INFO", "cache-service", "Cache hit for user:12345"],
  ["2024-12-25 10:00:03", "INFO", "api-gateway", "Response sent: 200 OK (45ms)"],
  ["2024-12-25 10:00:15", "WARN", "db-service", "Slow query detected (>100ms)"],
  ["2024-12-25 10:00:16", "INFO", "monitor", "Health check passed"],
  ["2024-12-25 10:00:30", "ERROR", "email-service", "SMTP connection timeout"],
  ["2024-12-25 10:00:31", "INFO", "email-service", "Retrying connection..."],
  ["2024-12-25 10:00:32", "INFO", "email-service", "Connection restored"],
  ["2024-12-25 10:01:00", "INFO", "scheduler", "Running scheduled task: cleanup"],
  ["2024-12-25 10:01:05", "INFO", "scheduler", "Task completed successfully"]
]
{{< /gridjs >}}

## Minimal Table (No Search/Sort)

For simple display without interactive features:

{{< gridjs columns=`["Feature", "Free Plan", "Pro Plan", "Enterprise"]` search="false" sort="false" >}}
[
  ["Storage", "5 GB", "100 GB", "Unlimited"],
  ["API Calls", "1,000/month", "100,000/month", "Unlimited"],
  ["Users", "1", "10", "Unlimited"],
  ["Support", "Community", "Email", "24/7 Priority"],
  ["SLA", "None", "99.9%", "99.99%"]
]
{{< /gridjs >}}

## Wide Table (Horizontal Scroll)

Tables wider than the container automatically get horizontal scroll:

{{< gridjs columns=`["ID", "Q1 Rev", "Q1 Cost", "Q1 Profit", "Q2 Rev", "Q2 Cost", "Q2 Profit", "Q3 Rev", "Q3 Cost", "Q3 Profit", "Q4 Rev", "Q4 Cost", "Q4 Profit", "YTD"]` >}}
[
  ["North", "$125k", "$85k", "$40k", "$142k", "$92k", "$50k", "$158k", "$98k", "$60k", "$175k", "$105k", "$70k", "$220k"],
  ["South", "$98k", "$72k", "$26k", "$112k", "$78k", "$34k", "$125k", "$82k", "$43k", "$138k", "$88k", "$50k", "$153k"],
  ["East", "$145k", "$95k", "$50k", "$162k", "$102k", "$60k", "$178k", "$108k", "$70k", "$195k", "$115k", "$80k", "$260k"],
  ["West", "$132k", "$88k", "$44k", "$148k", "$94k", "$54k", "$165k", "$100k", "$65k", "$182k", "$108k", "$74k", "$237k"]
]
{{< /gridjs >}}

---

## Usage Reference

### Markdown Table (Recommended)

```text
{{</* gridjs-md */>}}
| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Data 1   | Data 2   | Data 3   |
{{</* /gridjs-md */>}}
```

### Markdown with Inline Column Config

```text
{{</* gridjs-md pagination="10" */>}}
| Name {width=150px} | Description {wrap=constrained} |
|--------------------|--------------------------------|
| Item 1             | A long description here        |
{{</* /gridjs-md */>}}
```

### JSON Data Shortcode

```text
{{</* gridjs columns=`["Col1", "Col2"]` */>}}
[
  ["row1-col1", "row1-col2"],
  ["row2-col1", "row2-col2"]
]
{{</* /gridjs */>}}
```

### From Data File

```text
{{</* gridjs-data data="filename" pagination="20" */>}}
```

### Parameters

| Parameter | Default | Description |
|-----------|---------|-------------|
| `columns` | required | Column names or config objects |
| `search` | `true` | Enable search box |
| `sort` | `true` | Enable column sorting |
| `pagination` | none | Rows per page |
| `height` | none | Fixed height (e.g., "400px") |
| `width` | `100%` | Table width |
| `fixedHeader` | `false` | Sticky header on scroll |
| `resizable` | `false` | Draggable column widths |

{{< callout type="info" >}}
Remember to add `gridjs: true` to your page's front matter to load the Grid.js resources.
{{< /callout >}}
