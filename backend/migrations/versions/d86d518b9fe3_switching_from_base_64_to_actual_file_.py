"""Switching from base 64 to actual file for image storage

Revision ID: d86d518b9fe3
Revises: b23f2e6629a5
Create Date: 2025-01-20 11:07:28.642048

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'd86d518b9fe3'
down_revision = 'b23f2e6629a5'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('listing', sa.Column('thumbnail_path', sa.String(length=255), nullable=False))
    op.add_column('listing', sa.Column('other_image_paths', sa.JSON(), nullable=False))
    op.drop_column('listing', 'other_images')
    op.drop_column('listing', 'thumbnail_image')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('listing', sa.Column('thumbnail_image', sa.VARCHAR(length=1310720), autoincrement=False, nullable=False))
    op.add_column('listing', sa.Column('other_images', postgresql.JSON(astext_type=sa.Text()), autoincrement=False, nullable=False))
    op.drop_column('listing', 'other_image_paths')
    op.drop_column('listing', 'thumbnail_path')
    # ### end Alembic commands ###
