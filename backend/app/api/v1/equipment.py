from typing import Optional, List, Dict, Any
from fastapi import APIRouter, HTTPException, Query, status
from app.services.equipment_service import equipment_service
from app.models.equipment import EquipmentCreate, EquipmentOut, EquipmentDetailOut, EquipmentListResponse

router = APIRouter(prefix="/equipment", tags=["Equipment Discovery & Inventory"])

@router.get("", response_model=EquipmentListResponse)
async def list_equipment(
    search: Optional[str] = Query(None, description="Search by equipment name, model, description, or lab"),
    department: Optional[str] = Query(None, description="Filter by department code: ECE, CSE, MECH, CIVIL"),
    category: Optional[str] = Query(None, description="Filter by category"),
    status: Optional[str] = Query(None, description="Filter by status: available, in_use, maintenance"),
):
    """
    Search and filter equipment across CSE, ECE, Mechanical, and Civil departments.
    Returns live Supabase data or clean local fallback inventory.
    """
    result = equipment_service.get_equipment_list(
        search=search,
        department=department,
        category=category,
        status=status,
    )
    return result

@router.get("/meta/departments")
async def get_departments():
    """Returns available departments with codes and descriptions."""
    return equipment_service.get_departments()

@router.get("/meta/categories")
async def get_categories():
    """Returns all specialized equipment categories."""
    return equipment_service.get_categories()

@router.get("/{equipment_id}", response_model=EquipmentDetailOut)
async def get_equipment_detail(equipment_id: str):
    """
    Retrieve single equipment item specifications, lab location, and
    automatically recommended alternative equipment if unavailable.
    """
    item = equipment_service.get_equipment_by_id(equipment_id)
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Laboratory equipment with ID '{equipment_id}' not found.",
        )
    return item

@router.get("/{equipment_id}/alternatives", response_model=List[EquipmentOut])
async def get_equipment_alternatives(equipment_id: str):
    """
    Fetch smart alternative equipment recommendations in the same category or department
    when an item is booked or unavailable.
    """
    alternatives = equipment_service.get_alternatives(equipment_id)
    return alternatives

@router.post("", response_model=EquipmentOut, status_code=status.HTTP_201_CREATED)
async def create_equipment(payload: EquipmentCreate):
    """Register new equipment into the laboratory inventory mesh."""
    created = equipment_service.add_equipment(payload.model_dump())
    return created
