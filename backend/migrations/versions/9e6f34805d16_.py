"""empty message

Revision ID: 9e6f34805d16
Revises: 
Create Date: 2024-10-27 12:15:13.821061

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '9e6f34805d16'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('user',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('google_id', sa.String(length=120), nullable=False),
    sa.Column('email', sa.String(length=120), nullable=False),
    sa.Column('username', sa.String(length=80), nullable=True),
    sa.Column('name', sa.String(length=120), nullable=False),
    sa.Column('picture', sa.String(length=255), nullable=True),
    sa.Column('phone_number', sa.String(length=20), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email'),
    sa.UniqueConstraint('google_id'),
    sa.UniqueConstraint('username')
    )
    op.create_table('listing',
    sa.Column('id', sa.UUID(), nullable=False),
    sa.Column('title', sa.String(length=200), nullable=False),
    sa.Column('description', sa.Text(), nullable=False),
    sa.Column('price', sa.Float(), nullable=False),
    sa.Column('phone_number', sa.String(length=20), nullable=False),
    sa.Column('email_address', sa.String(length=120), nullable=False),
    sa.Column('thumbnail_image', sa.String(length=65536), nullable=False),
    sa.Column('other_images', sa.JSON(), nullable=False),
    sa.Column('condition', sa.String(length=20), nullable=False),
    sa.Column('date', sa.DateTime(), nullable=False),
    sa.Column('class_type', sa.String(length=50), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('saved_listings',
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('listing_id', sa.UUID(), nullable=False),
    sa.Column('saved_at', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['listing_id'], ['listing.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('user_id', 'listing_id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('saved_listings')
    op.drop_table('listing')
    op.drop_table('user')
    # ### end Alembic commands ###
