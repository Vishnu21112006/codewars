from typing import Dict, List, Optional, Any
from pydantic import BaseModel, Field

class EquipmentBase(BaseModel):
    name: str
    category: str
    department: str
    lab: str
    room: str
    model: str
    description: str
    specifications: Dict[str, Any] = Field(default_factory=dict)
    total_units: int = 1
    available_units: int = 1
    status: str = "available"  # 'available' | 'in_use' | 'maintenance' | 'decommissioned'
    requires_approval: bool = True
    safety_guidelines: Optional[str] = None
    hourly_rate: str = "Free"
    in_charge: Optional[str] = None
    image: Optional[str] = None

class EquipmentCreate(EquipmentBase):
    pass

class EquipmentOut(EquipmentBase):
    id: str

class EquipmentDetailOut(EquipmentOut):
    alternatives: List[EquipmentOut] = Field(default_factory=list)
    alternative_reason: Optional[str] = None

class EquipmentListResponse(BaseModel):
    total: int
    data_source: str  # 'supabase_live' | 'local_demo_mesh'
    items: List[EquipmentOut]
