// Tarjeta de invitación — réplica de activar-cuenta.dc.html
export function ActivationInviteCard() {
  return (
    <div className="mb-[22px] flex items-center gap-[14px] rounded-[16px] border-[1.5px] border-field-border bg-white px-4 py-[14px]">
      <div className="flex size-11 flex-none items-center justify-center rounded-full bg-child-avatar font-fredoka text-[19px] font-semibold text-child-avatar-ink">
        M
      </div>
      <div>
        <div className="text-[13px] text-muted-strong">Te invitaron a seguir a</div>
        <div className="font-fredoka text-[17px] font-semibold text-foreground">
          Mateo · Sala Soles
        </div>
      </div>
    </div>
  );
}
