"""Fix projectstatus enum and defaults"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '99c19d1472e5'
down_revision = '61fc71688fa4'
branch_labels = None
depends_on = None

def upgrade():
    # 1. Create the new enum type with all values
    new_status = postgresql.ENUM('draft', 'active', 'funded', 'failed', 'verified', name='projectstatus', create_type=False)
    new_status.create(op.get_bind(), checkfirst=True)

    # 2. Alter column to use new enum
    op.alter_column(
        'projects',
        'status',
        type_=new_status,
        existing_type=postgresql.ENUM('draft', 'funded', 'failed', 'verified', name='projectstatus'),
        postgresql_using="status::text::projectstatus"
    )

    # 3. Set default for status
    op.execute("ALTER TABLE projects ALTER COLUMN status SET DEFAULT 'draft';")


def downgrade():
    # Downgrade back to old enum (without 'active')
    old_status = postgresql.ENUM('draft', 'funded', 'failed', 'verified', name='projectstatus', create_type=False)
    op.alter_column(
        'projects',
        'status',
        type_=old_status,
        existing_type=postgresql.ENUM('draft', 'active', 'funded', 'failed', 'verified', name='projectstatus'),
        postgresql_using="status::text::projectstatus"
    )
    op.execute("ALTER TABLE projects ALTER COLUMN status SET DEFAULT 'draft';")
