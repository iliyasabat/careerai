from __future__ import annotations

import re
from datetime import date

import spacy


_NLP = spacy.load("en_core_web_sm")

# Skills keyword list (must include these exact strings)
SKILLS_KEYWORDS = [
    "Python",
    "JavaScript",
    "TypeScript",
    "Java",
    "Go",
    "Rust",
    "C++",
    "C#",
    "Ruby",
    "PHP",
    "Swift",
    "Kotlin",
    "Scala",
    "FastAPI",
    "Django",
    "Flask",
    "Express.js",
    "Spring Boot",
    "NestJS",
    "Rails",
    "Laravel",
    "React",
    "Vue.js",
    "Angular",
    "Next.js",
    "Svelte",
    "HTML",
    "CSS",
    "Tailwind CSS",
    "PostgreSQL",
    "MySQL",
    "SQLite",
    "MongoDB",
    "Redis",
    "Cassandra",
    "DynamoDB",
    "Elasticsearch",
    "Docker",
    "Kubernetes",
    "Terraform",
    "Ansible",
    "Jenkins",
    "GitHub Actions",
    "GitLab CI",
    "CircleCI",
    "AWS",
    "GCP",
    "Azure",
    "Vercel",
    "Netlify",
    "Heroku",
    "Railway",
    "Machine Learning",
    "Deep Learning",
    "NLP",
    "Computer Vision",
    "PyTorch",
    "TensorFlow",
    "Keras",
    "scikit-learn",
    "Pandas",
    "NumPy",
    "Matplotlib",
    "Seaborn",
    "Jupyter",
    "LangChain",
    "OpenAI",
    "Anthropic",
    "HuggingFace",
    "FAISS",
    "ChromaDB",
    "REST APIs",
    "GraphQL",
    "gRPC",
    "WebSockets",
    "Kafka",
    "RabbitMQ",
    "Celery",
    "Git",
    "Linux",
    "Bash",
    "SQL",
    "NoSQL",
    "Microservices",
    "System Design",
    "CI/CD",
    "Agile",
    "Scrum",
    "Product Management",
    "Figma",
    "Postman",
    "Jira",
]

# Extra keywords to make list broad (150+)
_EXTRA_SKILLS = [
    "Node.js",
    "React Native",
    "Redux",
    "Zustand",
    "MobX",
    "Vite",
    "Webpack",
    "Babel",
    "Sass",
    "Less",
    "Material UI",
    "Chakra UI",
    "ShadCN",
    "Prisma",
    "SQLAlchemy",
    "Alembic",
    "PostGIS",
    "TimescaleDB",
    "ClickHouse",
    "Supabase",
    "Firebase",
    "OpenTelemetry",
    "Prometheus",
    "Grafana",
    "Sentry",
    "Datadog",
    "Nginx",
    "Apache",
    "OAuth2",
    "JWT",
    "SAML",
    "OIDC",
    "REST",
    "SOAP",
    "OpenAPI",
    "Swagger",
    "gcloud",
    "AWS Lambda",
    "EC2",
    "S3",
    "RDS",
    "ECS",
    "EKS",
    "CloudFormation",
    "BigQuery",
    "Cloud Run",
    "Cloud Functions",
    "Azure Functions",
    "CosmosDB",
    "Serverless",
    "Kong",
    "Istio",
    "ArgoCD",
    "Helm",
    "Kustomize",
    "Packer",
    "Pulumi",
    "Airflow",
    "Dagster",
    "Spark",
    "Databricks",
    "dbt",
    "Snowflake",
    "MLflow",
    "ONNX",
    "OpenCV",
    "XGBoost",
    "LightGBM",
    "CatBoost",
    "Transformers",
    "BERT",
    "RAG",
    "Vector Database",
    "Pinecone",
    "Weaviate",
    "Milvus",
    "pytest",
    "unittest",
    "Playwright",
    "Cypress",
    "Jest",
    "Vitest",
    "Testing Library",
    "GitFlow",
    "Trunk Based Development",
    "Kanban",
    "OKRs",
]

_SKILL_SET_LOWER = {s.lower() for s in (SKILLS_KEYWORDS + _EXTRA_SKILLS)}


def extract_skills(text: str) -> list[str]:
    if not text:
        return []

    doc = _NLP(text)
    found: set[str] = set()

    # Keyword match (case-insensitive, with mild boundary handling)
    lowered = text.lower()
    for kw in _SKILL_SET_LOWER:
        if kw in lowered:
            found.add(kw)

    # Lightweight NER hints (PRODUCT/ORG often contains tech names)
    for ent in doc.ents:
        if ent.label_ in {"PRODUCT", "ORG", "WORK_OF_ART"}:
            val = ent.text.strip().lower()
            if val in _SKILL_SET_LOWER:
                found.add(val)

    # Return canonical capitalization where possible
    canonical = {s.lower(): s for s in (SKILLS_KEYWORDS + _EXTRA_SKILLS)}
    return sorted({canonical.get(k, k) for k in found})


_MONTHS = {
    "jan": 1,
    "january": 1,
    "feb": 2,
    "february": 2,
    "mar": 3,
    "march": 3,
    "apr": 4,
    "april": 4,
    "may": 5,
    "jun": 6,
    "june": 6,
    "jul": 7,
    "july": 7,
    "aug": 8,
    "august": 8,
    "sep": 9,
    "sept": 9,
    "september": 9,
    "oct": 10,
    "october": 10,
    "nov": 11,
    "november": 11,
    "dec": 12,
    "december": 12,
}

_DATE_RANGE_RE = re.compile(
    r"(?P<s_m>[A-Za-z]{3,9})?\s*(?P<s_y>\d{4})\s*(?:–|-|to)\s*(?P<e_m>[A-Za-z]{3,9}|present|current)?\s*(?P<e_y>\d{4})?",
    re.IGNORECASE,
)


def _parse_month(m: str | None) -> int:
    if not m:
        return 1
    return _MONTHS.get(m.strip().lower(), 1)


def _date_from_parts(month: str | None, year: str | None) -> date | None:
    if not year:
        return None
    return date(int(year), _parse_month(month), 1)


def extract_experience_years(text: str) -> float:
    if not text:
        return 0.0

    today = date.today()
    total_months = 0

    for m in _DATE_RANGE_RE.finditer(text):
        s = _date_from_parts(m.group("s_m"), m.group("s_y"))
        if s is None:
            continue

        e_m = m.group("e_m")
        e_y = m.group("e_y")
        if e_m and e_m.strip().lower() in {"present", "current"}:
            e = date(today.year, today.month, 1)
        else:
            e = _date_from_parts(e_m, e_y)

        if e is None:
            continue

        months = (e.year - s.year) * 12 + (e.month - s.month)
        if months > 0:
            total_months += months

    return round(total_months / 12.0, 2)
