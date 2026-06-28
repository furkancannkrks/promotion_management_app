import { useQuery } from "@tanstack/react-query";
import { Alert, Button, DatePicker, Form, Input, InputNumber, Radio, Select, Spin, Table, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";
import { useMemo, useState } from "react";

import { previewPromotion } from "../../api/promotionApi";
import { useAllProducts, useCategories, useCreatePromotion } from "../../hooks";
import { useDebounce } from "../../hooks/useDebounce";
import type { PromotionConflict } from "../../utils/promotionUtils";
import { queryKeys } from "../../utils/queryKeys";
import {
  validatePromotionForm,
  type PromotionFormErrors,
  type PromotionFormField,
  type PromotionFormValidationValues,
} from "../../utils/validationUtils";

import type { CreatePromotionDto, DiscountType, PreviewItem, PromotionTargetType } from "../../types";

interface PromotionFormState {
  name: string;
  discountType: DiscountType;
  value: number | null;
  startDate: Dayjs | null;
  endDate: Dayjs | null;
  couponCode: string;
  targetType: PromotionTargetType;
  targetProductIds: string[];
  targetCategory: string;
}

const initialFormState: PromotionFormState = {
  name: "",
  discountType: "percentage_off",
  value: null,
  startDate: null,
  endDate: null,
  couponCode: "",
  targetType: "category",
  targetProductIds: [],
  targetCategory: "",
};

const emptyPreviewPayload: CreatePromotionDto = {
  name: "Preview",
  discountType: "percentage_off",
  value: 0,
  startDate: dayjs().format("YYYY-MM-DD"),
  endDate: dayjs().format("YYYY-MM-DD"),
  targetType: "category",
  targetCategory: "",
};

const previewColumns: ColumnsType<PreviewItem> = [
  {
    title: "Product Name",
    dataIndex: "productName",
    key: "productName",
  },
  {
    title: "Current Price",
    dataIndex: "currentPrice",
    key: "currentPrice",
    render: (value: PreviewItem["currentPrice"]) => formatPrice(value),
  },
  {
    title: "New Effective Price",
    dataIndex: "newEffectivePrice",
    key: "newEffectivePrice",
    render: (value: PreviewItem["newEffectivePrice"]) => formatPrice(value),
  },
];

export function PromotionForm() {
  const [formState, setFormState] = useState<PromotionFormState>(initialFormState);
  const [touchedFields, setTouchedFields] = useState<Partial<Record<PromotionFormField, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [apiErrors, setApiErrors] = useState<PromotionFormErrors>({});
  const [conflicts, setConflicts] = useState<PromotionConflict[]>([]);
  const categoriesQuery = useCategories();
  const allProductsQuery = useAllProducts();
  const createPromotion = useCreatePromotion({
    onConflict: setConflicts,
    onValidationError: setApiErrors,
    onSuccess: resetForm,
  });
  const previewRequest = useMemo(() => {
    if (!isPreviewReady(formState)) {
      return null;
    }

    return toPreviewPayload(formState);
  }, [
    formState.discountType,
    formState.targetCategory,
    formState.targetProductIds,
    formState.targetType,
    formState.value,
  ]);
  const debouncedPreviewRequest = useDebounce(previewRequest, 500);
  const previewQuery = useQuery({
    queryKey: queryKeys.promotionPreview(debouncedPreviewRequest ?? emptyPreviewPayload),
    queryFn: () => previewPromotion(debouncedPreviewRequest ?? emptyPreviewPayload),
    enabled: previewRequest !== null && debouncedPreviewRequest !== null,
  });
  const validationValues = toValidationValues(formState);
  const allErrors = validatePromotionForm(validationValues);
  const visibleErrors = { ...getVisibleErrors(allErrors, touchedFields, submitted), ...apiErrors };

  function markTouched(field: PromotionFormField) {
    setTouchedFields((current) => ({ ...current, [field]: true }));
  }

  function updateFormState(field: PromotionFormField, nextState: PromotionFormState) {
    setFormState(nextState);
    setApiErrors((current) => removeFieldError(current, field));
  }

  function resetForm() {
    setFormState(initialFormState);
    setTouchedFields({});
    setSubmitted(false);
    setApiErrors({});
    setConflicts([]);
  }

  function handleSubmit() {
    setSubmitted(true);
    setApiErrors({});
    setConflicts([]);

    if (Object.keys(allErrors).length > 0) {
      return;
    }

    createPromotion.mutate(toCreatePromotionDto(formState));
  }

  return (
    <Form layout="vertical">
      <Form.Item label="Name" validateStatus={visibleErrors.name ? "error" : undefined} help={visibleErrors.name}>
        <Input
          value={formState.name}
          onBlur={() => {
            markTouched("name");
          }}
          onChange={(event) => {
            updateFormState("name", { ...formState, name: event.target.value });
          }}
        />
      </Form.Item>

      <Form.Item
        label="Discount Type"
        validateStatus={visibleErrors.discountType ? "error" : undefined}
        help={visibleErrors.discountType}
      >
        <Select<DiscountType>
          value={formState.discountType}
          onBlur={() => {
            markTouched("discountType");
          }}
          onChange={(value) => {
            updateFormState("discountType", { ...formState, discountType: value });
          }}
          options={[
            { label: "Percentage Off", value: "percentage_off" },
            { label: "Fixed Amount Off", value: "fixed_amount_off" },
          ]}
        />
      </Form.Item>

      <Form.Item label="Value" validateStatus={visibleErrors.value ? "error" : undefined} help={visibleErrors.value}>
        <InputNumber
          value={formState.value}
          onBlur={() => {
            markTouched("value");
          }}
          onChange={(value) => {
            updateFormState("value", { ...formState, value });
          }}
          style={{ width: "100%" }}
        />
      </Form.Item>

      <Form.Item
        label="Start Date"
        validateStatus={visibleErrors.startDate ? "error" : undefined}
        help={visibleErrors.startDate}
      >
        <DatePicker
          value={formState.startDate}
          onBlur={() => {
            markTouched("startDate");
          }}
          onChange={(value) => {
            updateFormState("startDate", { ...formState, startDate: value });
          }}
          style={{ width: "100%" }}
        />
      </Form.Item>

      <Form.Item label="End Date" validateStatus={visibleErrors.endDate ? "error" : undefined} help={visibleErrors.endDate}>
        <DatePicker
          value={formState.endDate}
          onBlur={() => {
            markTouched("endDate");
          }}
          onChange={(value) => {
            updateFormState("endDate", { ...formState, endDate: value });
          }}
          style={{ width: "100%" }}
        />
      </Form.Item>

      <Form.Item label="Coupon Code">
        <Input
          value={formState.couponCode}
          onChange={(event) => {
            setFormState({ ...formState, couponCode: event.target.value });
          }}
        />
      </Form.Item>

      <Form.Item
        label="Target Type"
        validateStatus={visibleErrors.targetType ? "error" : undefined}
        help={visibleErrors.targetType}
      >
        <Radio.Group
          value={formState.targetType}
          onBlur={() => {
            markTouched("targetType");
          }}
          onChange={(event) => {
            updateFormState("targetType", { ...formState, targetType: event.target.value as PromotionTargetType });
          }}
        >
          <Radio value="category">By Category</Radio>
          <Radio value="products">By Products</Radio>
        </Radio.Group>
      </Form.Item>

      {formState.targetType === "category" ? (
        <Form.Item
          label="Category"
          validateStatus={visibleErrors.targetCategory ? "error" : undefined}
          help={visibleErrors.targetCategory}
        >
          <Select
            loading={categoriesQuery.isLoading}
            value={formState.targetCategory}
            onBlur={() => {
              markTouched("targetCategory");
            }}
            onChange={(value: string) => {
              updateFormState("targetCategory", { ...formState, targetCategory: value });
            }}
            options={(categoriesQuery.data ?? []).map((category) => ({ label: category, value: category }))}
          />
        </Form.Item>
      ) : (
        <Form.Item
          label="Products"
          validateStatus={visibleErrors.targetProductIds ? "error" : undefined}
          help={visibleErrors.targetProductIds}
        >
          <Select
            loading={allProductsQuery.isLoading}
            mode="multiple"
            value={formState.targetProductIds}
            onBlur={() => {
              markTouched("targetProductIds");
            }}
            onChange={(value: string[]) => {
              updateFormState("targetProductIds", { ...formState, targetProductIds: value });
            }}
            options={(allProductsQuery.data?.products ?? []).map((product) => ({
              label: `${product.name} (${product.sku})`,
              value: product.id,
            }))}
          />
        </Form.Item>
      )}

      {conflicts.length > 0 ? (
        <Alert
          title="Cannot create promotion. The following conflicts were detected:"
          description={
            <ul>
              {conflicts.map((conflict) => (
                <li key={getConflictKey(conflict)}>{formatConflict(conflict)}</li>
              ))}
            </ul>
          }
          type="error"
          showIcon
          style={{ marginBottom: 16 }}
        />
      ) : null}

      {previewRequest !== null && debouncedPreviewRequest !== null ? (
        <div style={{ marginBottom: 24 }}>
          <Typography.Title level={5}>Preview — Affected Products</Typography.Title>
          {previewQuery.isFetching ? (
            <Spin />
          ) : (previewQuery.data?.affectedProducts.length ?? 0) > 0 ? (
            <Table<PreviewItem>
              columns={previewColumns}
              dataSource={previewQuery.data?.affectedProducts ?? []}
              pagination={false}
              rowKey="productId"
              size="small"
              scroll={{ x: true }}
            />
          ) : (
            <Typography.Text>No products would be affected</Typography.Text>
          )}
        </div>
      ) : null}

      <Button
        type="primary"
        htmlType="button"
        loading={createPromotion.isPending}
        onClick={() => {
          handleSubmit();
        }}
      >
        Create
      </Button>
    </Form>
  );
}

function toValidationValues(formState: PromotionFormState): PromotionFormValidationValues {
  return {
    name: formState.name,
    discountType: formState.discountType,
    value: formState.value,
    startDate: formState.startDate?.format("YYYY-MM-DD") ?? "",
    endDate: formState.endDate?.format("YYYY-MM-DD") ?? "",
    targetType: formState.targetType,
    targetProductIds: formState.targetProductIds,
    targetCategory: formState.targetCategory,
  };
}

function getVisibleErrors(
  errors: PromotionFormErrors,
  touchedFields: Partial<Record<PromotionFormField, boolean>>,
  submitted: boolean
): PromotionFormErrors {
  return Object.fromEntries(
    Object.entries(errors).filter(([field]) => submitted || touchedFields[field as PromotionFormField])
  ) as PromotionFormErrors;
}

function removeFieldError(errors: PromotionFormErrors, field: PromotionFormField): PromotionFormErrors {
  const { [field]: _removedError, ...remainingErrors } = errors;

  return remainingErrors;
}

function toCreatePromotionDto(formState: PromotionFormState): CreatePromotionDto {
  return {
    name: formState.name.trim(),
    discountType: formState.discountType,
    value: formState.value ?? 0,
    startDate: formState.startDate?.format("YYYY-MM-DD") ?? "",
    endDate: formState.endDate?.format("YYYY-MM-DD") ?? "",
    ...(formState.couponCode.trim() ? { couponCode: formState.couponCode.trim() } : {}),
    targetType: formState.targetType,
    ...(formState.targetType === "category" ? { targetCategory: formState.targetCategory } : {}),
    ...(formState.targetType === "products" ? { targetProductIds: formState.targetProductIds } : {}),
  };
}

function isPreviewReady(formState: PromotionFormState): boolean {
  if (formState.value === null || !formState.discountType) {
    return false;
  }

  if (formState.targetType === "category") {
    return formState.targetCategory.length > 0;
  }

  return formState.targetProductIds.length > 0;
}

function toPreviewPayload(formState: PromotionFormState): CreatePromotionDto {
  const previewDate = dayjs().format("YYYY-MM-DD");

  return {
    name: "Preview",
    discountType: formState.discountType,
    value: formState.value ?? 0,
    startDate: previewDate,
    endDate: previewDate,
    targetType: formState.targetType,
    ...(formState.targetType === "category" ? { targetCategory: formState.targetCategory } : {}),
    ...(formState.targetType === "products" ? { targetProductIds: formState.targetProductIds } : {}),
  };
}

function formatPrice(value: number): string {
  return `${value.toFixed(2)} TL`;
}

function getConflictKey(conflict: PromotionConflict): string {
  if (typeof conflict === "string") {
    return conflict;
  }

  return `${conflict.productId}-${conflict.conflictingPromotionId}`;
}

function formatConflict(conflict: PromotionConflict): string {
  if (typeof conflict === "string") {
    return conflict;
  }

  return `${conflict.productName} — already has '${conflict.conflictingPromotionName}' (Active)`;
}
